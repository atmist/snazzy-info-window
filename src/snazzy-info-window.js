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
            if (this._html.wrapper){
                var elements = this._html.wrapper
                    .getElementsByClassName(this._classPrefix + className);
                for (var i = 0; i < elements.length; i++){
                    if (lambda){
                        lambda.apply(this, [elements[i]]);
                    }
                }
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
        if (!this._marker || !this._html){
            return;
        }


        //Font
        if (this._html.wrapper){
            if (this._fontColor){
                this._html.wrapper.style.color = this._fontColor;
            }
            if (this._font){
                this._html.wrapper.style.font = this._font;
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

        //Assign offset
        if (this._offset) {
            if(this._offset.left) {
                this._html.wrapper.style.marginLeft = this._offset.left;
            }
            if (this._offset.top) {
                this._html.wrapper.style.marginTop = this._offset.top;
            }
        }

        //Assign pointer settings
        if (this.getPointerEnabled() && this._pointer && this._pointer.length){
            //1em, 1.0em, 0.1em, .1em, 1.    em
            var re = /^(\.{0,1}\d+(\.\d+)?)[\s|\.]*(\w*)$/;
            if (re.test(this._pointer.length)){
                var match = re.exec(this._pointer.length);
                var number = match[1];
                var unit = match[3] || "px";
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
            }else{
                this.warn('Pointer length ' + this._pointer.length + ' is invalid.');
            }
        }

        if (this._backgroundColor){
            this.eachByClassName('window', function(e){
                e.style.backgroundColor = this._backgroundColor;
            });
        }

        var markerPos = this.getProjection().fromLatLngToDivPixel(this._marker.position);
        this._html.wrapper.style.top = Math.floor(markerPos.y) + "px";
        this._html.wrapper.style.left = Math.floor(markerPos.x) + "px";
    };

    /*Implementation of OverlayView onAdd method.*/
    SnazzyInfoWindow.prototype.onAdd = function(){
        if (this.html){
            return;
        }

        //Create the html elements
        var html = {
            wrapper: document.createElement('div'),
            content: document.createElement('div'),
            pointer: null
        };

        //Assign class names
        var me = this;
        var addClass = function(element, className){
            if (element && className){
                if (element.className){
                    element.className += ' ';
                }
                element.className += me._classPrefix + className;
            }
        }
        addClass(html.content, 'window');
        addClass(html.content, 'box');
        addClass(html.content, 'content');
        addClass(html.wrapper, 'wrapper');
        if (this._wrapperClass){
            html.wrapper.className += " " + this._wrapperClass;
        }
        //Assign position
        addClass(html.wrapper, 'wrapper-' + this.getPosition());

        //Assign shadow
        if (this._hasShadow) {
            addClass(html.wrapper, 'has-shadow');
            html.shadow = document.createElement('div');
            addClass(html.shadow, 'shadow-wrapper-' + this.getPosition());

            // Content shadow
            html.contentShadow = document.createElement('div');
            addClass(html.contentShadow, 'box');
            addClass(html.contentShadow, 'shadow-box');

            html.shadow.appendChild(html.contentShadow);
            if (this.getPointerEnabled()){
                // Pointer shadow wrapper
                html.pointerShadowWrapper = document.createElement('div');
                addClass(html.pointerShadowWrapper, 'pointer-wrapper');
                addClass(html.pointerShadowWrapper, 'pointer-wrapper-' + this.getPosition());

                // Pointer shadow
                html.pointerShadow = document.createElement('div');
                addClass(html.pointerShadow, 'pointer');
                addClass(html.pointerShadow, 'shadow-pointer');

                html.pointerShadowWrapper.appendChild(html.pointerShadow);
                html.shadow.appendChild(html.pointerShadowWrapper);
            }
            html.wrapper.appendChild(html.shadow);
        }

        //Add the content
        this._html = html;
        if(this._content) {
            html.content.innerHTML = this._content;
        }
        html.wrapper.appendChild(html.content);

        //Assign pointer
        if (this.getPointerEnabled()) {

            // Pointer wrapper
            html.pointerWrapper = document.createElement('div');
            addClass(html.pointerWrapper, 'pointer-wrapper');
            addClass(html.pointerWrapper, 'pointer-wrapper-' + this.getPosition());

            // Pointer
            html.pointer = document.createElement('div');
            addClass(html.pointer, 'window');
            addClass(html.pointer, 'pointer');

            html.pointerWrapper.appendChild(html.pointer);
            html.wrapper.appendChild(html.pointerWrapper);
        }

        //Add the html elements
        this.getPane().appendChild(html.wrapper);
    };

    /*Implementation of OverlayView onRemove method*/
    SnazzyInfoWindow.prototype.onRemove = function(){
        if (!this._html){
            return;
        }
        var wrapper = this._html.wrapper;
        var parent = wrapper.parentElement;
        if (parent){
            parent.removeChild(wrapper);
        }
        this._html = undefined;
    };

    return SnazzyInfoWindow;
}));
