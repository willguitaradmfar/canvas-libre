# Usage

### Define canvas tag

```html
<canvas
  id="canvasLibre"
  width="800"
  height="600"
  style="border: 1px solid #d3d3d3;"
></canvas>
```

### Import the lib

```html
<script src="./canvas-libre.js"></script>
```

### Call the draw function passing obj parameter

```html
<script>
  const obj = {
    data: [
      {
        user: "user1",
        color: "blue",
        edges: [[300, 100]],
      },
    ],
  };
  draw(obj);
</script>
```
