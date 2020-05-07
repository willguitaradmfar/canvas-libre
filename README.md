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
 const points = []
  /**
   * Gerador de pontos
   */
  const dimensao = 10
  const tamanho = 50
  for(let c = 1 ; c <= dimensao ; c++){
    for(let l = 1 ; l <= dimensao ; l++){
      points.push({
        code: `C${c}L${l}`,
        coord: [c*tamanho, l*tamanho]
      })
    }
  }

  const obj = {
    data: [
      {
        user: 'user1',
        color: 'blue',
        edges: [
          ['C4L4', 'C4L5'],
          ['C4L4', 'C5L4']
        ]
      },
      {
        user: 'user2',
        color: 'red',
        edges: [
          ['C1L6', 'C1L7'],
          ['C1L7', 'C2L7'],
          ['C2L7', 'C2L6'],
          ['C2L6', 'C1L6']
        ]
      },
      {
        user: 'arcoiru',
        color: 'green',
        edges: [
          ['C5L6', 'C5L7'],
          ['C5L7', 'C6L7'],
          ['C6L7', 'C6L6']
        ]
      }
    ]
  }

  draw(obj, points)
</script>
```
