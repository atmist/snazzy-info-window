# snazzy-info-window
---

## Quick Start
1. Add a reference to Google Maps API.

```
<script src="https://maps.googleapis.com/maps/api/js?key={{YOUR KEY HERE}}"></script>
```

---

## Supported Settings

Settings can be applied through three different methods: javascript, sass, or css. Some settings are more complicated than others. This is why they might only be supported by javascript.

### General Settings

| Option | JS | SASS | CSS | Notes
|---|---|---|---|---|
| position | ✔ | ✘ | ✘ |
| content | ✔ | ✘ | ✘ |
| wrapper class | ✔ | ✘ | ✘ |
| offset left | ✔ | ✘ | ✔ |
| offset top | ✔ | ✘ | ✔ |
| background color | ✔ | ✔ | ✔ |
| content padding | ✔ | ✔ | ✔ |
| border radius | ✔ | ✔ | ✔ |
| font color | ✔ | ✔ | ✔ |
| font | ✔ | ✔ | ✔ |

### Border Settings

| Option | JS | SASS | CSS | Notes
|---|---|---|---|---|
| border enabled | ✔ | ✔ | ✘ |
| border width | ✔ | ✔ | ✘ |
| border style | ✔ | ✔ | ✘ |
| border color | ✔ | ✔ | ✘ |

### Pointer Settings

| Option | JS | SASS | CSS | Notes
|---|---|---|---|---|
| pointer enabled | ✔ | ✘* | ✘ |
| pointer length | ✔ | ✔ | ✘ |

### Shadow Settings

| Option | JS | SASS | CSS | Notes
|---|---|---|---|---|
| shadow enabled | ✔ | ✔ | ✘ |
| shadow horizontal | ✔ | ✔ | ✘ |
| shadow vertical | ✔ | ✔ | ✘ |
| shadow blur | ✔ | ✔ | ✘ |
| shadow spread | ✔ | ✔ | ✘ |
| shadow color | ✔ | ✔ | ✘ |
| shadow opacity | ✔ | ✔ | ✘ |

---



## Testing

The test framework requires npm to be installed on your computer.

### Setting up test environment
1. ``` npm install ```
2. ``` npm run gulp -- build ```

### Cleaning test environment
1. ``` npm run gulp -- clean ```
2. ``` npm install rimraf -g ```
3. ``` rimraf node_modules ```
