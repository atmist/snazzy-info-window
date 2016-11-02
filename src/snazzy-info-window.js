// Global variables
const _classPrefix = 'si-';
const _root2 = 1.41421356237;
const _inverseRoot2 = 0.7071067811865474;
const _defaultShadow = {
    h: '0px',
    v: '3px',
    blur: '6px',
    spread: '0px',
    color: '#000'
};
const _defaultOptions = {
    position: 'top',
    pointer: true,
    openOnMarkerClick: true,
    closeOnMapClick: true,
    showCloseButton: true,
    panOnOpen: true,
    edgeOffset: {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20
    }
};

// Copy keys from the source into the target
function copyKeys(target, source) {
    if (target && source) {
        Object.keys(source).forEach((key) => {
            target[key] = source[key];
        });
    }
}

// We need to safely merge options from the defaults. This will make
// sure settings like edgeOffset are properly assigned.
function mergeDefaultOptions(opts) {
    const copy = {};
    copyKeys(copy, _defaultOptions);
    copyKeys(copy, opts);
    Object.keys(_defaultOptions).forEach((key) => {
        const obj = _defaultOptions[key];
        if (typeof obj === 'object') {
            const objCopy = {};
            copyKeys(objCopy, obj);
            copyKeys(objCopy, copy[key]);
            copy[key] = objCopy;
        }
    });
    return copy;
}

// Parse a css attribute into the numeric portion and the units
function parseAttribute(attribute, defaultValue) {
    // 1em, 1.0em, 0.1em, .1em, 1.    em
    const re = /^(-{0,1}\.{0,1}\d+(\.\d+)?)[\s|\.]*(\w*)$/;
    if (attribute && re.test(attribute)) {
        const match = re.exec(attribute);
        const number = match[1];
        const units = match[3] || 'px';
        return { value: number * 1, units, original: attribute };
    }
    if (defaultValue) {
        return parseAttribute(defaultValue);
    }
    return { original: defaultValue };
}

export default class SnazzyInfoWindow extends google.maps.OverlayView {

    constructor(opts) {
        super(opts);
        // Private properties
        this._html = null;
        this._opts = mergeDefaultOptions(opts);
        this._callbacks = this._opts.callbacks || {};
        this._marker = this._opts.marker;
        this._isOpen = false;

        // All listeners that are attached to google maps
        this._listeners = {};
        if (google && this._marker && this._opts.openOnMarkerClick) {
            this._listeners.openOnMarkerClick = google.maps.event.addListener(this._marker, 'click', () => {
                if (!this.getMap()) {
                    this.open();
                }
            });
        }

        // Validate the options
        let p = this._opts.position;
        if (p) {
            p = p.toLowerCase();
        }
        if (p !== 'top' && p !== 'bottom' &&
            p !== 'left' && p !== 'right') {
            this._opts.position = _defaultOptions.position;
        }
        if (this._opts.border === undefined) {
            this._opts.border = {};
        }
        if (this._opts.pointer === undefined) {
            this._opts.pointer = _defaultOptions.pointer;
        }
        if (this._opts.shadow === undefined) {
            this._opts.shadow = {};
        }
    }

    // Activate the specified callback and return the result
    activateCallback(callback) {
        const lamda = this._callbacks[callback];
        return lamda ? lamda.apply(this) : undefined;
    }

    // Remove a listener from google events
    removeListener(key) {
        if (google && this._listeners[key]) {
            google.maps.event.removeListener(this._listeners[key]);
            this._listeners[key] = null;
        }
    }

    // Open the info window after attaching to a specific marker.
    open() {
        const result = this.activateCallback('beforeOpen');
        if (result !== undefined && !result) {
            return;
        }
        if (this._marker) {
            const map = this._marker.getMap();
            this.setMap(map);
            if (this._opts.closeOnMapClick) {
                this.removeListener('closeOnMapClick');
                this._listeners.closeOnMapClick = map.addListener('click', () => {
                    this.close();
                });
            }
            if (google) {
                // Clear out the previous map bounds
                this._previousWidth = null;
                this._previousHeight = null;
                this.removeListener('onBoundsChanged');
                this._listeners.onBoundsChanged = google.maps.event.addListener(map, 'bounds_changed', () => {
                    const d = map.getDiv();
                    const ow = d.offsetWidth;
                    const oh = d.offsetHeight;
                    const pw = this._previousWidth;
                    const ph = this._previousHeight;
                    if (pw === null || ph === null || pw !== ow || ph !== oh) {
                        this._previousWidth = ow;
                        this._previousHeight = oh;
                        this.resize();
                    }
                });
            }
        }
    }

    // Close the info window.
    close() {
        const result = this.activateCallback('beforeClose');
        if (result !== undefined && !result) {
            return;
        }
        Object.keys(this._listeners).forEach((key) => {
            if (key !== 'openOnMarkerClick') {
                this.removeListener(key);
            }
        });
        this.setMap(null);
    }

    // Force close the map and remove any event listeners attached to google
    destroy() {
        if (this.getMap()) {
            this.setMap(null);
        }
        Object.keys(this._listeners).forEach((key) => {
            this.removeListener(key);
        });
    }

    setContent(content) {
        this._opts.content = content;
        if (this._html) {
            this._html.content.innerHTML = content;
        }
    }

    // Implementation of OverlayView draw method.
    draw() {
        if (!this._marker || !this._html) {
            return;
        }

        // Returns a capitalized position for assigning styles
        let p = this._opts.position;
        p = p.charAt(0).toUpperCase() + p.slice(1);
        const capitalizedPosition = p;

        // 1. Assign offset
        const offset = this._opts.offset;
        if (offset) {
            if (offset.left) {
                this._html.wrapper.style.marginLeft = offset.left;
            }
            if (offset.top) {
                this._html.wrapper.style.marginTop = offset.top;
            }
        }
        // 2. Set the background color
        const bg = this._opts.backgroundColor;
        if (bg) {
            this._html.content.style.backgroundColor = bg;
            if (this._opts.pointer) {
                this._html.pointerBg.style[`border${capitalizedPosition}Color`] = bg;
            }
        }
        // 3. Padding
        if (this._opts.padding) {
            this._html.contentWrapper.style.padding = this._opts.padding;
            this._html.shadowFrame.style.padding = this._opts.padding;
        }
        // 4. Border radius
        if (this._opts.borderRadius) {
            this._html.contentWrapper.style.borderRadius = this._opts.borderRadius;
            this._html.shadowFrame.style.borderRadius = this._opts.borderRadius;
        }
        // 5. Font Color
        if (this._opts.fontColor) {
            this._html.wrapper.style.color = this._opts.fontColor;
        }
        // 6. Font Size
        if (this._opts.fontSize) {
            this._html.wrapper.style.fontSize = this._opts.fontSize;
        }
        // 7. Border
        if (this._opts.border) {
            if (this._opts.border.width !== undefined) {
                const bWidth = parseAttribute(this._opts.border.width, '0px');
                this._html.contentWrapper.style.borderWidth = bWidth.value + bWidth.units;
                if (this._opts.pointer) {
                    this._html.pointerBg.style[this._opts.position] =
                        Math.round(-bWidth.value * _root2) + bWidth.units;
                }
            }
            const color = this._opts.border.color;
            if (color) {
                this._html.contentWrapper.style.borderColor = color;
                if (this._opts.pointer) {
                    this._html.pointerBorder.style[`border${capitalizedPosition}Color`] = color;
                }
            }
        } else {
            // Hide the border when border is set to false
            this._html.content.style.borderWidth = 0;
            if (this._opts.pointer) {
                this._html.pointerBg.style[this._opts.position] = 0;
            }
        }
        // 8. Pointer
        // Check if the pointer is enabled. Also make sure the value isn't just the boolean true.
        if (this._opts.pointer && this._opts.pointer !== true) {
            if (this._opts.shadow) {
                this._html.shadowPointer.style.width = this._opts.pointer;
                this._html.shadowPointer.style.height = this._opts.pointer;
            }
            this._html.pointerBorder.style.borderWidth = this._opts.pointer;
            this._html.pointerBg.style.borderWidth = this._opts.pointer;
        }

        // 9. Shadow
        if (this._opts.shadow) {
            // Check if any of the shadow settings have actually been set
            const shadow = this._opts.shadow;
            const isSet = (attribute) => {
                const v = shadow[attribute];
                return v !== undefined && v != null;
            };

            if (isSet('h') || isSet('v') || isSet('blur') || isSet('spread') || isSet('color')) {
                const hOffset = parseAttribute(shadow.h, _defaultShadow.h);
                const vOffset = parseAttribute(shadow.v, _defaultShadow.v);
                const blur = parseAttribute(shadow.blur, _defaultShadow.blur);
                const spread = parseAttribute(shadow.spread, _defaultShadow.spread);
                const color = shadow.color || _defaultShadow.color;
                const formatBoxShadow = (h, v) => {
                    return `${h} ${v} ${blur.original} ${spread.original} ${color}`;
                };

                this._html.shadowFrame.style.boxShadow =
                    formatBoxShadow(hOffset.original, vOffset.original);

                // Correctly rotate the shadows before the css transform
                const hRotated = (_inverseRoot2 * (hOffset.value - vOffset.value)) + hOffset.units;
                const vRotated = (_inverseRoot2 * (hOffset.value + vOffset.value)) + vOffset.units;
                this._html.shadowPointerInner.style.boxShadow = formatBoxShadow(hRotated, vRotated);
            }
            if (this._opts.shadow.opacity) {
                this._html.shadowWrapper.style.opacity = this._opts.shadow.opacity;
            }
        }

        const markerPos = this.getProjection().fromLatLngToDivPixel(this._marker.position);
        this._html.floatWrapper.style.top = `${Math.floor(markerPos.y)}px`;
        this._html.floatWrapper.style.left = `${Math.floor(markerPos.x)}px`;

        if (!this._isOpen) {
            this._isOpen = true;
            this.resize();
            this.reposition();
            this.activateCallback('afterOpen');
        }
    }

    // Implementation of OverlayView onAdd method.
    onAdd() {
        if (this._html) {
            return;
        }
        // Used for creating new elements
        const applyCss = (element, args) => {
            if (element && args) {
                for (let i = 0; i < args.length; i++) {
                    const className = args[i];
                    if (className) {
                        if (element.className) {
                            element.className += ' ';
                        }
                        element.className += _classPrefix + className;
                    }
                }
            }
        };
        const newElement = (...args) => {
            const element = document.createElement('div');
            applyCss(element, args);
            return element;
        };

        this._html = {};

        // 1. Create the wrapper
        this._html.wrapper = newElement(
            `wrapper-${this._opts.position}`
        );
        if (this._opts.wrapperClass) {
            this._html.wrapper.className += ` ${this._opts.wrapperClass}`;
        }

        // 2. Create the shadow
        if (this._opts.shadow) {
            this._html.shadowWrapper = newElement(
                `shadow-wrapper-${this._opts.position}`
            );
            this._html.shadowFrame = newElement(
                'frame',
                'shadow-frame'
            );
            this._html.shadowWrapper.appendChild(this._html.shadowFrame);

            if (this._opts.pointer) {
                this._html.shadowPointer = newElement(
                    `shadow-pointer-${this._opts.position}`
                );
                this._html.shadowPointerInner = newElement(
                    `shadow-inner-pointer-${this._opts.position}`
                );
                this._html.shadowPointer.appendChild(this._html.shadowPointerInner);
                this._html.shadowWrapper.appendChild(this._html.shadowPointer);
            }

            this._html.wrapper.appendChild(this._html.shadowWrapper);
        }

        // 3. Create the content
        this._html.contentWrapper = newElement(
            'frame',
            'content-wrapper'
        );
        this._html.content = newElement(
            'content'
        );
        if (this._opts.content) {
            this._html.content.innerHTML = this._opts.content;
        }

        // 4. Create the close button
        if (this._opts.showCloseButton) {
            if (this._opts.closeButtonMarkup) {
                const d = document.createElement('div');
                d.innerHTML = this._opts.closeButtonMarkup;
                this._html.closeButton = d.firstChild;
            } else {
                this._html.closeButton = document.createElement('button');
                this._html.closeButton.setAttribute('type', 'button');
                this._html.closeButton.innerHTML = '&#215;';
                applyCss(this._html.closeButton, ['close-button']);
            }
            this._html.contentWrapper.appendChild(this._html.closeButton);
        }
        this._html.contentWrapper.appendChild(this._html.content);
        this._html.wrapper.appendChild(this._html.contentWrapper);

        // 5. Create the pointer
        if (this._opts.pointer) {
            this._html.pointerBorder = newElement(
                `pointer-${this._opts.position}`,
                `pointer-border-${this._opts.position}`
            );
            this._html.pointerBg = newElement(
                `pointer-${this._opts.position}`,
                `pointer-bg-${this._opts.position}`
            );
            this._html.wrapper.appendChild(this._html.pointerBorder);
            this._html.wrapper.appendChild(this._html.pointerBg);
        }

        // Create an outer wrapper
        this._html.floatWrapper = newElement(
            'float-wrapper'
        );
        this._html.floatWrapper.appendChild(this._html.wrapper);

        // Add the wrapper to the Google Maps float pane
        this.getPanes().floatPane.appendChild(this._html.floatWrapper);

        this.activateCallback('open');
    }

    // Implementation of OverlayView onRemove method
    onRemove() {
        this.activateCallback('close');
        if (this._html) {
            const parent = this._html.floatWrapper.parentElement;
            if (parent) {
                parent.removeChild(this._html.floatWrapper);
            }
            this._html = null;
        }
        this._isOpen = false;
        this.activateCallback('afterClose');
    }

    // The map inner bounds used for panning and resizing
    getMapInnerBounds() {
        const mb = this.getMap().getDiv().getBoundingClientRect();
        const mib = {
            top: mb.top + this._opts.edgeOffset.top,
            right: mb.right - this._opts.edgeOffset.right,
            bottom: mb.bottom - this._opts.edgeOffset.bottom,
            left: mb.left + this._opts.edgeOffset.left
        };
        mib.width = mib.right - mib.left;
        mib.height = mib.bottom - mib.top;
        return mib;
    }

    // Pan the google map such that the info window is visible
    reposition() {
        if (!this._opts.panOnOpen || !this._html) {
            return;
        }
        const mib = this.getMapInnerBounds();
        const wb = this._html.wrapper.getBoundingClientRect();
        let dx = 0;
        let dy = 0;
        if (mib.left >= wb.left) {
            dx = wb.left - mib.left;
        } else if (mib.right <= wb.right) {
            dx = wb.left - (mib.right - wb.width);
        }
        if (mib.top >= wb.top) {
            dy = wb.top - mib.top;
        } else if (mib.bottom <= wb.bottom) {
            dy = wb.top - (mib.bottom - wb.height);
        }
        if (dx !== 0 || dy !== 0) {
            this.getMap().panBy(dx, dy);
        }
    }

    // Resize the info window to fit within the map bounds and edge offset
    resize() {
        if (!this._html) {
            return;
        }
        const mib = this.getMapInnerBounds();
        // Handle the max width
        let maxWidth = mib.width;
        if (this._opts.maxWidth !== undefined) {
            maxWidth = Math.min(maxWidth, this._opts.maxWidth);
        }
        maxWidth -= (this._html.wrapper.offsetWidth - this._html.content.offsetWidth);
        this._html.content.style.maxWidth = `${maxWidth}px`;

        // Handle the max height
        let maxHeight = mib.height;
        if (this._opts.maxHeight !== undefined) {
            maxHeight = Math.min(maxHeight, this._opts.maxHeight);
        }
        maxHeight -= (this._html.wrapper.offsetHeight - this._html.content.offsetHeight);
        this._html.content.style.maxHeight = `${maxHeight}px`;
    }
}
