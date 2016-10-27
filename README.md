# Snazzy Info Window

Snazzy Info Window is a library for customizable popup windows in the Google Maps JavaScript API.

## Demos

- [Simple Example](https://codepen.io/snazzymaps/pen/dpAbGN/)
- [Advanced Example](https://codepen.io/snazzymaps/pen/vXPBKJ)

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
  <script src="https://maps.googleapis.com/maps/api/js?key={{YOUR KEY HERE}}"></script>
  <script src="snazzy-info-window.js"></script>
  <script src="snazzy-info-window.css"></script>
  ```

1. Create a new `SnazzyInfoWindow` and open it.
  ```js
  var infoWindow = new SnazzyInfoWindow({
      marker: marker,
      content: 'Snazzy!',
  });
  infoWindow.open();
  ```

## Features

- **Custom position**
  - Position the info window to the top, bottom, right, or left of the marker.
- **Custom styling**
  - Customize the border radius, shadow, background color, border, and much more.

## Public Methods

#### open()

Will attempt to open the info window.

#### close()

Will attempt to close the info window.

#### destroy()

Will destroy the info window. If the info window is open it will be forced
closed bypassing the regular `beforeClose` callback. All google map event
listeners associated to this info window will be removed.

#### setContent(content)

Set the content in the info window. This can be called at any time.

## Options

```js
var options = {
    marker: marker,
    content: '<div>Hello, World!</div>',
    wrapperClass: 'custom-info-window',
    maxWidth: '200px',
    maxHeight: '200px',
    backgroundColor: 'black',
    padding: '40px',
    borderRadius: '2px 20px',
    fontColor: '#eee',
    fontSize: '16px',
    pointer: '30px',
    offset: {
        top: '10px',
        left: '10px'
    },
    border: {
        width: '20px'
        color: '#FF0000'
    },
    shadow: {
        h: '10px',
        v: '10px',
        blur: '6px',
        spread: '0px',
        opacity: 0.5,
        color: 'black'
    },
    openOnMarkerClick: true,
    closeOnMapClick: true,    
    showCloseButton: true,
    callbacks:{
        beforeOpen: function(){
            console.log('Info window will start opening.');
        },
        open: function(){
            console.log('Info window has started opening.');
        },
        afterOpen: function(){
            console.log('Info window has opened.');
        },
        beforeClose: function(){
            console.log('Info window will start closing.');
        },
        close: function(){
            console.log('Info window has started closing.');
        },
        afterClose: function(){
            console.log('Info window has closed.')
        }
    }
};
```

#### content

The text or HTML to insert into the info window body.

- Type: _string_

#### position

Choose where you want the info window to be displayed, relative to the marker.

- Type: _string_
- Default: `'top'`
- Possible Values: `'top'`, `'bottom'`, `'left'`, `'right'`

#### wrapperClass

An optional CSS class to assign to the wrapper container of the info window. Can be
used for applying custom CSS to the info window.

- Type: _string_

#### maxWidth

The max width of the content wrapper excluding padding.

- Type: _string_
- Example: `'200px'`

#### maxHeight

The max height of the content wrapper excluding padding.

- Type: _string_
- Example: `'200px'`

#### offset

- Type: _object_
- Example:

  ```js
  offset: {
    top: '10px',
    left: '20px'
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

#### border

A custom border around the info window.

- Type: _object_
- Example:

  ```js
  border: {
    width: '10px',
    color: '#FF0000'
  }
  ```

#### pointer

The height of the pointer from the info window to the marker.

- Type: _string_
- Possible Values: Any valid CSS size value.
- Example: `'10px'`

#### shadow

The CSS properties for the shadow of the info window.

- Type: _object_
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
listener is added to the google maps `click` event which calls the `open()`
method.

- Type: _boolean_
- Default: `true`

#### closeOnMapClick

Determines if the info window will close when the map is clicked. An internal
listener is added to the google maps `click` event which calls the `close()`
method. This will not activate on the google maps `drag` event when the user is
panning the map.

- Type: _boolean_
- Default: `true`

#### showCloseButton

Determines if the info window will show a close button.

- Type: _boolean_
- Default: `true`

### callbacks

All callbacks are optional and can access the info window instance via `this`.

#### beforeOpen

Called before the info window attempts to open. Return `false`
to cancel the open.

- Type: _function_
- Example:
  ```js
  function(){
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
  function(){
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
  function(){
      console.log('Info window has opened.');
  }
  ```

#### beforeClose

Called before the info window attempts to close. Return `false`
to cancel the close.

- Type: _function_
- Example:
  ```js
  function(){
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
  function(){
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
  function(){
      console.log('Info window has closed.');
  }
  ```
