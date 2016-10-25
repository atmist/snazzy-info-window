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
1. Include the required files.

  ```html
  <script src="https://maps.googleapis.com/maps/api/js?key={{YOUR KEY HERE}}"></script>
  <script src="snazzy-info-window.js"></script>
  <script src="snazzy-info-window.css"></script>
  ```

1. Create a new `SnazzyInfoWindow` and attach it to a marker.
  ```js
  var infoWindow = new SnazzyInfoWindow({
      content: 'Snazzy!',
  });

  infoWindow.attach(marker);
  ```

## Features

- **Custom position**
  - Position the info window to the top, bottom, right, or left of the marker.
- **Custom styling**
  - Customize the border radius, shadow, background color, border, and much more.

## Methods

#### attach(marker)

#### open()

#### close()

## Options

```js
var options = {
    content: '<div>Hello, World!</div>',
    wrapperClass: 'custom-info-window',
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
