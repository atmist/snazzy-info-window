# Snazzy Info Window

[![npm](https://img.shields.io/npm/v/snazzy-info-window.svg?label=yarn)](https://www.npmjs.com/package/snazzy-info-window) [![npm](https://img.shields.io/npm/v/snazzy-info-window.svg)](https://www.npmjs.com/package/snazzy-info-window) [![Bower](https://img.shields.io/bower/v/snazzy-info-window.svg)](https://github.com/atmist/snazzy-info-window) [![Dependencies](https://david-dm.org/atmist/snazzy-info-window.svg)](https://david-dm.org/atmist/snazzy-info-window) [![devDependencies](https://david-dm.org/atmist/snazzy-info-window/dev-status.svg)](https://david-dm.org/atmist/snazzy-info-window#info=devDependencies)

Snazzy Info Window is a plugin for customizable info windows using the Google Maps JavaScript API.
Open sourced by the people that created [Snazzy Maps](https://snazzymaps.com).

## Features

- **Responsive sizing**
  - The info window will size properly for a variety of screen and map sizes.
- **Custom styling**
  - Customize the border radius, shadow, background color, border, and much more.
  - Supports SCSS styling.
- **Dynamic content**
  - Supports dynamic content after initialization with proper resizing.
- **Multiple placements**
  - Place the info window to the top, bottom, right, or left of the marker.

## Examples

- [Simple](/examples#simple)
- [Multiple markers](/examples#multiple-markers)
- [Dynamic content](/examples#dynamic-content)
- [Set position](/examples#set-position)
- [Styling with SCSS](/examples#scss-styles)
- [Styling with JavaScript](/examples#js-styles)
- [Complex styling](/examples#complex-styles)

## Installation

You can install Snazzy Info Window from the following package managers:

```sh
yarn add snazzy-info-window
```

```sh
npm install --save snazzy-info-window
```

```sh
bower install --save snazzy-info-window
```

## Quick Start
1. Include all the required files.

  ```html
  <link rel="stylesheet" href="snazzy-info-window.min.css">
  <script src="https://maps.googleapis.com/maps/api/js?key={{YOUR KEY HERE}}"></script>
  <script src="snazzy-info-window.min.js"></script>
  ```

1. Create a new `SnazzyInfoWindow` object with a marker.
  ```js
  var infoWindow = new SnazzyInfoWindow({
      marker: marker,
      content: 'Snazzy!'
  });
  ```

## Public Methods

#### open()

Will attempt to open the info window.

#### close()

Will attempt to close the info window.

#### isOpen()

Determines if the info window is open.

#### destroy()

Will destroy the info window. If the info window is open it will be forced
closed bypassing the regular `beforeClose` callback. All Google Map event
listeners associated to this info window will be removed.

#### setContent(content)

Set the content in the info window. This can be called at any time.

- Parameter: `content`
  - _string_ or _DOM Element_

#### setPosition(latLng)

Set the `position` of the info window. A valid Google Map instance must be associated to the info window. This could be either through the `marker` or `map` option.

- Parameter: `latLng`
  - _[LatLng]_ or _[LatLngLiteral]_

#### getWrapper()

Will return the DOM Element for the wrapper container of the info window.

## Options

#### marker

The Google Maps marker associated to this info window.

- Type: _[Marker]_

#### content

The text or DOM Element to insert into the info window body.

- Type: _string_ or _DOM Element_

#### placement

Choose where you want the info window to be displayed, relative to the marker.

- Type: _string_
- Default: `'top'`
- Possible Values: `'top'`, `'bottom'`, `'left'`, `'right'`

#### map

The Google Map associated to this info window. Only required if you are not using a `marker`.

- Type: _[Map]_

#### position

The latitude and longitude where the info window is anchored. The `offset` will default to `0px` when using this option. Only required if you are not using a `marker`.

- Type: _[LatLng]_ or _[LatLngLiteral]_

#### wrapperClass

An optional CSS class to assign to the wrapper container of the info window. Can be
used for applying custom CSS to the info window.

- Type: _string_

#### maxWidth

The max width in pixels of the info window.

- Type: _numeric_
- Example: `200`

#### maxHeight

The max height in pixels of the info window.

- Type: _numeric_
- Example: `200`

#### offset

The offset from the marker. This value should be different for each `placement`.
By default the offset is configured for the default Google Maps marker.

- Type: _object_
- Example:

  ```js
  offset: {
    top: '10px',
    left: '20px'
  }
  ```

#### edgeOffset

The offset from the map edge in pixels which is used when panning an info window
into view.

- Type: _object_
- Example:

  ```js
  edgeOffset: {
    top: 20,
    right: 20,
    bottom: 20,
    left: 20
  }
  ```

#### backgroundColor

The color to use for the background of the info window.

- Type: _string_
- Possible Values: Any valid CSS color value.
- Examples: `'#FF0000'`, `'blue'`

#### padding

A custom padding size around the content of the info window.

- Type: _string_
- Possible Values: Any valid CSS size value.
- Examples: `'10px'`, `'2em'`, `'5%'`

#### border

A custom border around the info window. Set to `false` to completely remove
the border. The units used for `border` should be the same as `pointer`.

- Type: _object_ or _boolean_
- Example:

  ```js
  border: {
    width: '10px',
    color: '#FF0000'
  }
  ```

#### borderRadius

A custom CSS border radius property to specify the rounded corners of the info window.

- Type: _string_
- Example: `'2px 20px'`

#### fontColor

The font color to use for the content inside the body of the info window.

- Type: _string_
- Possible Values: Any valid CSS color value.
- Examples: `'#FF0000'`, `'blue'`


#### fontSize

The font size to use for the content inside the body of the info window.

- Type: _string_
- Possible Values: Any valid CSS font size value.

#### pointer

The height of the pointer from the info window to the marker. Set to `false`
to completely remove the pointer. The units used for `pointer` should be the
same as `border`.

- Type: _string_ or _boolean_
- Possible Values: Any valid CSS size value.
- Example: `'10px'`

#### shadow

The CSS properties for the shadow of the info window. Set to `false` to
completely remove the shadow.

- Type: _object_ or _boolean_
- Default:

  ```js
  shadow: {
      h: '0px',
      v: '3px',
      blur: '6px',
      spread: '0px',
      opacity: 0.5,
      color: '#000'
  }
  ```

#### openOnMarkerClick

Determines if the info window will open when the marker is clicked. An internal
listener is added to the Google Maps `click` event which calls the `open()`
method.

- Type: _boolean_
- Default: `true`

#### closeOnMapClick

Determines if the info window will close when the map is clicked. An internal
listener is added to the Google Maps `click` event which calls the `close()`
method. This will not activate on the Google Maps `drag` event when the user is
panning the map.

- Type: _boolean_
- Default: `true`

#### closeWhenOthersOpen

Determines if the info window will close when any other Snazzy Info Window is opened.

- Type: _boolean_
- Default: `false`

#### showCloseButton

Determines if the info window will show a close button.

- Type: _boolean_
- Default: `true`

#### closeButtonMarkup

The text or DOM Element to replace the default close button. No click handler or
positioning is added to your markup if you use this option.

- Type: _string_ or _DOM Element_

#### panOnOpen

Determines if the info window will be panned into view when opened.

- Type: _boolean_
- Default: `true`

### callbacks

All callbacks are optional and can access the info window instance via `this`.

- Type: _object_
- Example:

    ```js
    callbacks: {
        beforeOpen: function(){},
        open: function(){},
        afterOpen: function(){},
        beforeClose: function(){},
        close: function(){},
        afterClose: function(){}
    }
    ```

#### beforeOpen

Called before the info window attempts to open. Return `false`
to cancel the open.

- Type: _function_
- Example:

  ```js
  function() {
      console.log('Cancel opening the info window.');
      return false;
  }
  ```

#### open

Called when the info window is opening. This occurs at the end of the
OverlayView `onAdd()` implementation. At this point the info window is added
to the DOM but is not drawn yet.

- Type: _function_
- Example:

  ```js
  function() {
      console.log('Info window has started opening.');
  }
  ```

#### afterOpen

Called when the info window has opened. This occurs at the end of the
OverlayView `draw()` implementation. At this point the info window is added
to the DOM and should be visible.

- Type: _function_
- Example:

  ```js
  function() {
      console.log('Info window has opened.');
  }
  ```

#### beforeClose

Called before the info window attempts to close. Return `false`
to cancel the close.

- Type: _function_
- Example:

  ```js
  function() {
      console.log('Cancel closing the info window.');
      return false;
  }
  ```

#### close

Called when the info window is closing. This occurs at the beginning of the
OverlayView `onRemove()` implementation. At this point the info window is still
in the DOM.

- Type: _function_
- Example:

  ```js
  function() {
      console.log('Info window has started closing.');
  }
  ```

#### afterClose

Called after the info window has closed. This occurs at the end of the
OverlayView `onRemove()` implementation. At this point the info window should
be removed from the DOM.

- Type: _function_
- Example:

  ```js
  function() {
      console.log('Info window has closed.');
  }
  ```

## HTML Structure

```html
<div class="si-float-wrapper">
    <div class="si-wrapper-top">
        <div class="si-shadow-wrapper-top">
            <div class="si-shadow-frame"></div>
            <div class="si-shadow-pointer-top">
                <div class="si-shadow-inner-pointer-top"></div>
            </div>
        </div>
        <div class="si-content-wrapper">
            <button class="si-close-button"></div>
            <div class="si-content">
                <!-- Your content goes here -->
            </div>
        </div>
        <div class="si-pointer-border-top"></div>
        <div class="si-pointer-bg-top"></div>
    </div>
</div>
```

#### si-float-wrapper

Used to absolute position the info window in the Google Maps floatPane.

#### si-wrapper-`placement`

Used to css translate the info window into the `placement`. The `wrapperClass`
is added to this element's class list.

#### si-shadow-wrapper-`placement`

Used to blend opacity for all shadow elements. This div will not be included if
`shadow` is `false`.

#### si-shadow-frame

Used to create the box shadow for the content wrapper. This element will not be
included if `shadow` is `false`.

#### si-shadow-pointer-`placement`

Used to show the pointer shadow in the `placement`. This element will not be included if
`shadow` or `pointer` is `false`.

#### si-shadow-inner-pointer-`placement`

Used to create the shadow for the pointer. This element will not be included if
`shadow` or `pointer` is `false`.

#### si-content-wrapper

Used for adding padding and border around the content.

#### si-close-button

Used for showing the default close button in the top right hand corner. This
element will not be included if `showCloseButton` is `false`.

#### si-content

Used for wrapping your content and showing a scroll bar when there is overflow.

#### si-pointer-border-`placement`

Used for rendering the tip of the pointer when there is a border present.
This element will not be included if `pointer` or `border` is `false`.

#### si-pointer-bg-`placement`

Used for rendering the inner tip of the pointer when there is a border present.
This element will not be included if `pointer` is `false`.


## Contributing

If you find a bug with the library, please open an issue. If you would like fix
an issue or contribute a feature, follow the steps outlined
[here](./CONTRIBUTING.md).


[LatLng]: https://developers.google.com/maps/documentation/javascript/reference#LatLng
[LatLngLiteral]: https://developers.google.com/maps/documentation/javascript/reference#LatLngLiteral
[Marker]: https://developers.google.com/maps/documentation/javascript/reference#Marker
[Map]: https://developers.google.com/maps/documentation/javascript/reference#Map
