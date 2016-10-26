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
        this._marker = null;
        this._floatWrapper = null;
        this._opts = opts || {};

        // Validate the options
        let p = this._opts.position;
        if (p) {
            p = p.toLowerCase();
        }
        if (p !== 'top' && p !== 'bottom' &&
            p !== 'left' && p !== 'right') {
            this._opts.position = 'top';
        }
        if (this._opts.border === undefined) {
            this._opts.border = {};
        }
        if (this._opts.pointer === undefined) {
            this._opts.pointer = true;
        }
        if (this._opts.shadow === undefined) {
            this._opts.shadow = {};
        }
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

    // Attach the info window to the specific marker.
    attach(marker) {
        if (google && marker !== undefined) {
            this._marker = marker;
            google.maps.event.addListener(this._marker, 'click', () => {
                this.open();
            });
        }
    }

    // Open the info window after attaching to a specific marker.
    open() {
        if (this._marker) {
            this.setMap(this._marker.getMap());
        }
    }

    // Close the info window.
    close() {
        this.setMap(null);
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
                const hOffset = parseAttribute(shadow.h, _defaultShadow.h);
                const vOffset = parseAttribute(shadow.v, _defaultShadow.v);
                const blur = parseAttribute(shadow.blur, _defaultShadow.blur);
                const spread = parseAttribute(shadow.spread, _defaultShadow.spread);
                const color = shadow.color || _defaultShadow.color;
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
        if (this._opts.maxHeight){
            this.eachByClassName('content-wrapper', (e) => {
                e.style.maxHeight = this._opts.maxHeight;
            });
        }
        if (this._opts.maxWidth){
            this.eachByClassName('content-wrapper', (e) => {
                e.style.maxWidth = this._opts.maxWidth;
            });
        }

        const markerPos = this.getProjection().fromLatLngToDivPixel(this._marker.position);
        this._floatWrapper.style.top = `${Math.floor(markerPos.y)}px`;
        this._floatWrapper.style.left = `${Math.floor(markerPos.x)}px`;
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
    }

    // Implementation of OverlayView onRemove method
    onRemove() {
        if (this._floatWrapper) {
            const parent = this._floatWrapper.parentElement;
            if (parent) {
                parent.removeChild(this._floatWrapper);
            }
            this._floatWrapper = null;
        }
    }
}
