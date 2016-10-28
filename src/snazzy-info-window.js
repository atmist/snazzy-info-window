// Global variables
const _classPrefix = 'si-';
const _root2 = 1.41421356237;
const _inverseRoot2 = 0.7071067811865474;
const _defaultOptions = {
    position: 'top',
    pointer: true,
    openOnMarkerClick: true,
    closeOnMapClick: true,
    showCloseButton: true,
    panOnOpen: true,
    shadow: {
        h: '0px',
        v: '3px',
        blur: '6px',
        spread: '0px',
        color: '#000'
    },
    edgeOffset: {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20
    }
};

// We need to safely merge options from the defaults. This will make
// sure settings like edgeOffset are properly assigned.
function mergeDefaultOptions(opts) {
    const copy = Object.assign({}, _defaultOptions, opts);
    Object.keys(_defaultOptions).forEach((key) => {
        const obj = _defaultOptions[key];
        if (typeof obj === 'object') {
            copy[key] = Object.assign({}, obj, copy[key]);
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
        this._floatWrapper = null;
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

    // Go through each element under the wrapper with the provided class name
    eachByClassName(className, lambda) {
        if (this._floatWrapper) {
            const elements = this._floatWrapper.getElementsByClassName(_classPrefix + className);
            for (let i = 0; i < elements.length; i++) {
                if (lambda) {
                    lambda.apply(this, [elements[i]]);
                }
            }
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
                if (google && this._listeners.closeOnMapClick) {
                    google.maps.event.removeListener(this._listeners.closeOnMapClick);
                }
                this._listeners.closeOnMapClick = map.addListener('click', () => {
                    this.close();
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
        if (google && this._listeners.closeOnMapClick) {
            google.maps.event.removeListener(this._listeners.closeOnMapClick);
        }
        this.setMap(null);
    }

    // Force close the map and remove any event listeners attached to google
    destroy() {
        if (this.getMap()) {
            this.setMap(null);
        }
        if (google) {
            Object.keys(this._listeners).forEach((key) => {
                google.maps.event.removeListener(this._listeners[key]);
            });
        }
    }

    setContent(content) {
        this._opts.content = content;
        this.eachByClassName('content', (e) => {
            e.innerHTML = content;
        });
    }

    // Implementation of OverlayView draw method.
    draw() {
        if (!this._marker || !this._floatWrapper) {
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
                this.eachByClassName(`wrapper-${this._opts.position}`, (e) => {
                    e.style.marginLeft = offset.left;
                });
            }
            if (offset.top) {
                this.eachByClassName(`wrapper-${this._opts.position}`, (e) => {
                    e.style.marginTop = offset.top;
                });
            }
        }
        // 2. Set the background color
        const bg = this._opts.backgroundColor;
        if (bg) {
            this.eachByClassName('content', (e) => {
                e.style.backgroundColor = bg;
            });
            if (this._opts.pointer) {
                this.eachByClassName(`pointer-bg-${this._opts.position}`, (e) => {
                    e.style[`border${capitalizedPosition}Color`] = bg;
                });
            }
        }
        // 3. Padding
        if (this._opts.padding) {
            this.eachByClassName('frame', (e) => {
                e.style.padding = this._opts.padding;
            });
        }
        // 4. Border radius
        if (this._opts.borderRadius) {
            this.eachByClassName('frame', (e) => {
                e.style.borderRadius = this._opts.borderRadius;
            });
        }
        // 5. Font Color
        if (this._opts.fontColor) {
            this.eachByClassName(`wrapper-${this._opts.position}`, (e) => {
                e.style.color = this._opts.fontColor;
            });
        }
        // 6. Font Size
        if (this._opts.fontSize) {
            this.eachByClassName(`wrapper-${this._opts.position}`, (e) => {
                e.style.fontSize = this._opts.fontSize;
            });
        }
        // 7. Border
        if (this._opts.border) {
            if (this._opts.border.width !== undefined) {
                const bWidth = parseAttribute(this._opts.border.width, '0px');
                this.eachByClassName('content', (e) => {
                    e.style.borderWidth = bWidth.value + bWidth.units;
                });
                if (this._opts.pointer) {
                    this.eachByClassName(`pointer-bg-${this._opts.position}`, (e) => {
                        e.style[this._opts.position] =
                            Math.round(-bWidth.value * _root2) + bWidth.units;
                    });
                }
            }
            const color = this._opts.border.color;
            if (color) {
                this.eachByClassName('content', (e) => {
                    e.style.borderColor = color;
                });
                if (this._opts.pointer) {
                    this.eachByClassName(`pointer-border-${this._opts.position}`, (e) => {
                        e.style[`border${capitalizedPosition}Color`] = color;
                    });
                }
            }
        } else {
            // Hide the border when border is set to false
            this.eachByClassName('content', (e) => {
                e.style.borderWidth = 0;
            });
            if (this._opts.pointer) {
                this.eachByClassName(`pointer-bg-${this._opts.position}`, (e) => {
                    e.style[this._opts.position] = 0;
                });
            }
        }
        // 8. Pointer
        // Check if the pointer is enabled. Also make sure the value isn't just the boolean true.
        if (this._opts.pointer && this._opts.pointer !== true) {
            if (this._opts.shadow) {
                this.eachByClassName(`shadow-pointer-${this._opts.position}`, (e) => {
                    e.style.width = this._opts.pointer;
                    e.style.height = this._opts.pointer;
                });
            }
            this.eachByClassName(`pointer-${this._opts.position}`, (e) => {
                e.style.borderWidth = this._opts.pointer;
            });
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
                const hOffset = parseAttribute(shadow.h, _defaultOptions.shadow.h);
                const vOffset = parseAttribute(shadow.v, _defaultOptions.shadow.v);
                const blur = parseAttribute(shadow.blur, _defaultOptions.shadow.blur);
                const spread = parseAttribute(shadow.spread, _defaultOptions.shadow.spread);
                const color = shadow.color || _defaultOptions.shadow.color;
                const formatBoxShadow = (h, v) => {
                    return `${h} ${v} ${blur.original} ${spread.original} ${color}`;
                };

                this.eachByClassName('shadow-frame', (e) => {
                    e.style.boxShadow = formatBoxShadow(hOffset.original, vOffset.original);
                });
                // Correctly rotate the shadows before the css transform
                const hRotated = (_inverseRoot2 * (hOffset.value - vOffset.value)) + hOffset.units;
                const vRotated = (_inverseRoot2 * (hOffset.value + vOffset.value)) + vOffset.units;
                this.eachByClassName(`shadow-inner-pointer-${this._opts.position}`, (e) => {
                    e.style.boxShadow = formatBoxShadow(hRotated, vRotated);
                });
            }
            if (this._opts.shadow.opacity) {
                this.eachByClassName(`shadow-wrapper-${this._opts.position}`, (e) => {
                    e.style.opacity = this._opts.shadow.opacity;
                });
            }
        }

        // 10. Dimensions
        if (this._opts.maxHeight) {
            this.eachByClassName('content-wrapper', (e) => {
                e.style.maxHeight = this._opts.maxHeight;
            });
        }
        if (this._opts.maxWidth) {
            this.eachByClassName('content-wrapper', (e) => {
                e.style.maxWidth = this._opts.maxWidth;
            });
        }

        const markerPos = this.getProjection().fromLatLngToDivPixel(this._marker.position);
        this._floatWrapper.style.top = `${Math.floor(markerPos.y)}px`;
        this._floatWrapper.style.left = `${Math.floor(markerPos.x)}px`;

        if (!this._isOpen) {
            this._isOpen = true;
            this.reposition();
            this.activateCallback('afterOpen');
        }
    }

    // Implementation of OverlayView onAdd method.
    onAdd() {
        if (this._floatWrapper) {
            return;
        }
        // Used for creating new elements
        const newElement = (...args) => {
            const element = document.createElement('div');
            if (args) {
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
            return element;
        };

        // 1. Create the wrapper
        const wrapper = newElement(
            `wrapper-${this._opts.position}`
        );
        if (this._opts.wrapperClass) {
            wrapper.className += ` ${this._opts.wrapperClass}`;
        }

        // 2. Create the shadow
        if (this._opts.shadow) {
            const shadowWrapper = newElement(
                `shadow-wrapper-${this._opts.position}`
            );
            const shadowFrame = newElement(
                'frame',
                'shadow-frame'
            );
            shadowWrapper.appendChild(shadowFrame);

            if (this._opts.pointer) {
                const shadowPointer = newElement(
                    `shadow-pointer-${this._opts.position}`
                );
                const shadowPointerInner = newElement(
                    `shadow-inner-pointer-${this._opts.position}`
                );
                shadowPointer.appendChild(shadowPointerInner);
                shadowWrapper.appendChild(shadowPointer);
            }

            wrapper.appendChild(shadowWrapper);
        }

        // 3. Create the content
        const contentWrapper = newElement(
            'frame',
            'content-wrapper'
        );
        const content = newElement(
            'content'
        );
        if (this._opts.content) {
            content.innerHTML = this._opts.content;
        }
        contentWrapper.appendChild(content);
        wrapper.appendChild(contentWrapper);

        // 4. Create the pointer
        if (this._opts.pointer) {
            const pointerBorder = newElement(
                `pointer-${this._opts.position}`,
                `pointer-border-${this._opts.position}`
            );
            const pointerBg = newElement(
                `pointer-${this._opts.position}`,
                `pointer-bg-${this._opts.position}`
            );
            wrapper.appendChild(pointerBorder);
            wrapper.appendChild(pointerBg);
        }

        // Create an outer wrapper
        const floatWrapper = newElement(
            'float-wrapper'
        );
        floatWrapper.appendChild(wrapper);
        this._floatWrapper = floatWrapper;

        // Add the wrapper to the Google Maps float pane
        this.getPanes().floatPane.appendChild(this._floatWrapper);

        this.activateCallback('open');
    }

    // Implementation of OverlayView onRemove method
    onRemove() {
        this.activateCallback('close');
        if (this._floatWrapper) {
            const parent = this._floatWrapper.parentElement;
            if (parent) {
                parent.removeChild(this._floatWrapper);
            }
            this._floatWrapper = null;
        }
        this._isOpen = false;
        this.activateCallback('afterClose');
    }

    // Pan the google map such that the info window is visible
    reposition() {
        if (!this._opts.panOnOpen) {
            return;
        }
        const map = this._marker.getMap();
        // Map bounds
        const mb = map.getDiv().getBoundingClientRect();
        // Map inner bounds
        const mib = {
            top: mb.top + this._opts.edgeOffset.top,
            right: mb.right - this._opts.edgeOffset.right,
            bottom: mb.bottom - this._opts.edgeOffset.bottom,
            left: mb.left + this._opts.edgeOffset.left
        };

        this.eachByClassName(`wrapper-${this._opts.position}`, (e) => {
            // Wrapper bounds
            const wb = e.getBoundingClientRect();
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
                map.panBy(dx, dy);
            }
        });
    }
}
