"use strict";

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD.
        define([], factory);
    } else if (typeof exports === 'object') {
         // Node, CommonJS-like
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.SnazzyInfoWindow = factory();
    }
}(this, function () {

    function SnazzyInfoWindow(options){
        this._marker = null;
        this._classPrefix = "si-";
        this._content = options.content;
        this._offset = options.offset;
        this._position = options.position;
        this._pointer = options.pointer;
        this._hasShadow = options.hasShadow;
        this._wrapperClass = options.wrapperClass;
        this._warningPrefix = "Snazzy Info Window warning: ";
        this._backgroundColor = options.backgroundColor;
        this._contentPadding = options.contentPadding;
        this._borderRadius = options.borderRadius;
        this._fontColor = options.fontColor;
        this._font = options.font;
        this._border = options.border;

        //Create an instance using the superclass OverlayView
        google.maps.OverlayView.apply(this, arguments);

        //Get the pane used for displaying the overlay
        this.getPane = function(){
            return this.getPanes()["floatPane"];
        };

        //Get the position of the info window relative to the marker
        this.getPosition = function(){
            if (this._position == 'top' || this._position == 'bottom' ||
                this._position == 'left' || this._position == 'right' ) {
                return this._position;
            }else{
                return 'top';
            }
        };

        this.getPointerEnabled = function(){
            return this._pointer === undefined || this._pointer.enabled !== false;
        };

        this.warn = function(message){
            if (message){
                console.warn(this._warningPrefix + message);
            }
        };

        //Go through each element under the wrapper with the provided classname
        this.eachByClassName = function(className, lambda){
            if (this._wrapper){
                var elements = this._wrapper
                    .getElementsByClassName(this._classPrefix + className);
                for (var i = 0; i < elements.length; i++){
                    if (lambda){
                        lambda.apply(this, [elements[i]]);
                    }
                }
            }
        };

		//Parse a css attribute into the numeric portion and the units
		this.parseAttribute = function(attribute, onSuccess, onError){
			//1em, 1.0em, 0.1em, .1em, 1.    em
            var re = /^(\.{0,1}\d+(\.\d+)?)[\s|\.]*(\w*)$/;
            if (re.test(attribute)){
                var match = re.exec(attribute);
                var number = match[1];
                var unit = match[3] || "px";
				if (onSuccess){
					onSuccess.apply(this, [number*1, unit]);
				}
            }else if(onError){
				onError.apply(this, []);
            }
		};
    };

    /*Extend the OverlayView in the Google Maps API.*/
    SnazzyInfoWindow.prototype = new google.maps.OverlayView();

    /*Attach the info window to the specific marker.*/
    SnazzyInfoWindow.prototype.attach = function(marker){
        var me = this;
        if (google !== undefined && marker !== undefined){
            me._marker = marker;
            google.maps.event.addListener(me._marker, "click", function (e) {
                me.open();
            });
        }
    };

    /*Open the info window after attaching to a specific marker.*/
    SnazzyInfoWindow.prototype.open = function(){
        if (this._marker !== undefined){
            this.setMap(this._marker.getMap());
        }
    };

    /*Close the info window.*/
    SnazzyInfoWindow.prototype.close = function(){
        this.setMap(null);
    }

    /*Implementation of OverlayView draw method.*/
    SnazzyInfoWindow.prototype.draw = function(){
        if (!this._marker || !this._wrapper){
            return;
        }

        //Font
        if (this._wrapper){
            if (this._fontColor){
                this._wrapper.style.color = this._fontColor;
            }
            if (this._font){
                this._wrapper.style.font = this._font;
            }
        }

        //Content Padding
        if (this._contentPadding){
            this.eachByClassName('box', function(e){
                e.style.padding = this._contentPadding;
            });
        }

        //Border radius
        if (this._borderRadius){
            this.eachByClassName('box', function(e){
                e.style.borderRadius = this._borderRadius;
            });
        }

        //Border
        if (this._border){
            this.eachByClassName('window', function(e){
                e.style.border = this._border;
            });
        }
        var borderWidth = 0;
        this.eachByClassName('window', function(e){
            if(getComputedStyle !== undefined){
                borderWidth = getComputedStyle(e)
                    .getPropertyValue('border-left-width');
            }
        });
        var position = this.getPosition();
        this.eachByClassName('pointer-wrapper', function(e){
            if (position == 'top'){
                e.style.marginTop = "-" + borderWidth;
            }
            else if (position == 'bottom'){
                e.style.marginBottom = "-" + borderWidth;
            }
            else if (position == 'left'){
                e.style.marginLeft = "-" + borderWidth;
            }
            else if (position == 'right'){
                e.style.marginRight = "-" + borderWidth;
            }
        });


        //Assign offset
        if (this._offset) {
            if(this._offset.left) {
                this._wrapper.style.marginLeft = this._offset.left;
            }
            if (this._offset.top) {
                this._wrapper.style.marginTop = this._offset.top;
            }
        }

        //Assign pointer settings
        if (this.getPointerEnabled() && this._pointer && this._pointer.length){
            //1em, 1.0em, 0.1em, .1em, 1.    em
			this.parseAttribute(this._pointer.length, function(number, unit){
				var root2 = 1.41421356237;
	            this.eachByClassName('pointer', function(e){
	                e.style.width = (number * root2) + unit;
	                e.style.height = (number * root2) + unit;
	            });
	            var position = this.getPosition();
	            this.eachByClassName('pointer-wrapper', function(e){
	                if (position == 'top' || position == 'bottom'){
	                    e.style.height = number + unit;
	                }else{
	                    e.style.width = number + unit;
	                }
	            });
			}, function(){
				this.warn('Pointer length ' + this._pointer.length + ' is invalid.');
			});
        }
        if (this._backgroundColor){
            this.eachByClassName('window', function(e){
                e.style.backgroundColor = this._backgroundColor;
            });
        }
        var markerPos = this.getProjection().fromLatLngToDivPixel(this._marker.position);
        this._wrapper.style.top = Math.floor(markerPos.y) + "px";
        this._wrapper.style.left = Math.floor(markerPos.x) + "px";
    };

    /*Implementation of OverlayView onAdd method.*/
    SnazzyInfoWindow.prototype.onAdd = function(){
        if (this._wrapper){
            return;
        }

        //Used for assigning class names
        var me = this;
        var addClass = function(element, className){
            if (element && className){
                if (element.className){
                    element.className += ' ';
                }
                element.className += me._classPrefix + className;
            }
        };
		//Used for creating new elements
		var newElement = function(classNames){
			var element = document.createElement('div');
			if(classNames){
				for(var i = 0; i < classNames.length; i++){
					addClass(element, classNames[i]);
				}
			}
			return element;
		};

		//1. Create the wrapper
		var wrapper = newElement([
			'wrapper',
			'wrapper-' + this.getPosition(),
			//Will only add the class name if it exists
			this._wrapperClass
		]);
		this._wrapper = wrapper;

		//2. Create the shadow DOM elements, order does matter
        if (this._hasShadow) {
			//Additional Wrapper class
			addClass(wrapper, 'has-shadow');
			//Shadow wrapper
			var shadowWrapper = newElement([
				'shadow-wrapper-' + this.getPosition()
			]);
            // Content shadow
            var contentShadow = newElement([
				'box',
				'shadow-box'
			]);
            shadowWrapper.appendChild(contentShadow);
			// Pointer shadow
            if (this.getPointerEnabled()){
                // Pointer shadow wrapper
				var pointerShadowWrapper = newElement([
					'pointer-wrapper',
					'pointer-wrapper-' + this.getPosition()
				]);
                // Pointer shadow
				var pointerShadow = newElement([
					'pointer',
					'shadow-pointer'
				]);
                pointerShadowWrapper.appendChild(pointerShadow);
                shadowWrapper.appendChild(pointerShadowWrapper);
            }
			wrapper.appendChild(shadowWrapper);
        }

		//3. Create the content
		var content = newElement([
			'window',
			'box',
			'content'
		]);
        if(this._content) {
			content.innerHTML = this._content;
        }
		wrapper.appendChild(content);

        //4. Create the pointer
        if (this.getPointerEnabled()) {
            // Pointer wrapper
            var pointerWrapper = newElement([
				'pointer-wrapper',
				'pointer-wrapper-' + this.getPosition()
			]);
            // Pointer
            var pointer = newElement([
				'window',
				'pointer',
				'pointer-foreground'
			]);
            pointerWrapper.appendChild(pointer);
            wrapper.appendChild(pointerWrapper);
        }

        //Add the html elements
        this.getPane().appendChild(wrapper);
    };

    /*Implementation of OverlayView onRemove method*/
    SnazzyInfoWindow.prototype.onRemove = function(){
		if (this._wrapper){
	        var parent = this._wrapper.parentElement;
	        if (parent){
	            parent.removeChild(this._wrapper);
	        }
			this._wrapper = null;
		}
    };

    return SnazzyInfoWindow;
}));
