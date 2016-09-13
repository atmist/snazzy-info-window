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
        this._classPrefix = "snazzy-info-";
        this._content = options.content;
        this._offset = options.offset;
        this._position = options.position;
        this._pointer = options.pointer;

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
        this._html = html;
        html.content.innerHTML = this._content;
        html.wrapper.appendChild(html.content);

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
        addClass(html.content, 'content');
        addClass(html.wrapper, 'wrapper');

        //Assign styles
        html.wrapper.style.position = "absolute";

        //Assign offset
        if (this._offset) {
            if(this._offset.left) {
                html.wrapper.style.marginLeft = this._offset.left;
            }
            if (this._offset.top) {
                html.wrapper.style.marginTop = this._offset.top;
            }
        }

        //Assign Position
        addClass(html.wrapper, 'wrapper-' + this.getPosition());

        //Assign pointer
        if (this._pointer === undefined || this._pointer.enabled !== false) {

            html.pointer = document.createElement('div');
            if (this._pointer && this._pointer.length){
                html.pointer.style.height = this._pointer.length
                html.pointer.style.width = "calc(" + this._pointer.length + " * 2)";
            }
            addClass(html.pointer, 'pointer-' + this.getPosition());

            html.wrapper.appendChild(html.pointer);
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
