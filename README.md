# Usage

### Define canvas tag

```html
<canvas id="canvasLibre"></canvas>
```

### Import the lib

```html
<script src="https://unpkg.com/deepmerge@4.2.2/dist/umd.js"></script>
<script src="https://unpkg.com/mqtt@4.0.1/dist/mqtt.min.js"></script>
<script src="./src/core/Game.js"></script>
<script src="./src/implementation/LogicaMarota.js"></script>
```

### Call the draw function passing obj parameter

```html
<script>
  new LogicaMarota('#canvasLibre')
</script>
```
