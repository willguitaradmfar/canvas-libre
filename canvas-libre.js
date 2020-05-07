const lineWidth = 2
const pointWidth = 2



const drawCircle = ({ ctx, x, y, rad, sAng, eAng, color = 'blue' }) => {
  ctx.beginPath()
  ctx.arc(x, y, rad, sAng, eAng * Math.PI)
  ctx.fillStyle = color
  ctx.fill()
  ctx.closePath()
}

const drawLine = ({ ctx, moveX, moveY, lineX, lineY, color }) => {
  ctx.beginPath()
  ctx.lineWidth = lineWidth
  ctx.moveTo(moveX, moveY)
  ctx.lineTo(lineX, lineY)
  ctx.strokeStyle = color
  ctx.stroke()
  ctx.closePath()
}

const drawPoint = ({ ctx, x, y, color }) => {
  ctx.beginPath()
  ctx.arc(x, y, pointWidth, 0, 2 * Math.PI, true);
  ctx.strokeStyle = color
  ctx.fill()
  ctx.closePath()
}

function * generateId () {
  while (true) {
    const random = Math.floor(Math.random() * Date.now() + 1)
    yield random
  }
}

class Canvas {
  constructor ({ ctx, color = 'black', user }) {
    this.ctx = ctx
    this.color = color
    this.user = user || `anonymous_${generateId().next().value}`
  }

  draw ({ edges }) {

    if (!edges.length) {
      throw new Error('empty edges')
    }
  
    for(const edge of edges) {

      if(!edge.from || !edge.to) continue

      const moveX = edge.from.coord[0]
      const moveY = edge.from.coord[1]

      const lineX = edge.to.coord[0]
      const lineY = edge.to.coord[1]

      drawLine({
        ctx: this.ctx,
        moveX,
        moveY,
        lineX,
        lineY,
        color: this.color
      })
    }
    return this
  }

  toString () {
    console.log(this.user)
    return this.user
  }
}

const raioEdge = 30

const draw = (obj, points) => {
  

  for(const point of points){
    drawPoint({ ctx, color: 'black', x: point.coord[0], y: point.coord[1] })
  }

  obj.data.map(item => {
    new Canvas({
      ctx,
      color: item.color,
      user: item.user
    })
      .draw({
        edges: item.edges.map(edge => {
          return {
            from: points.find(point => point.code === edge[0]),
            to: points.find(point => point.code === edge[1])
          }
        })
      })
      .toString()
  })
}

const setup = () => {
  const c = document.getElementById('canvasLibre')
  const ctx = c.getContext('2d')

  function mouseMove(event) {
    houver(event.offsetX, event.offsetY)
  }
  
  function houver(x, y) {
    const _points = points.filter(point => {
      const distancia = Math.hypot((x - point.coord[0]), (y - point.coord[1]))
      return distancia < raioEdge
    })

    if(_points.length !== 2) return

    const moveX = _points[0].coord[0]
    const moveY = _points[0].coord[1]

    const lineX = _points[1].coord[0]
    const lineY = _points[1].coord[1]

    drawLine({
      ctx,
      moveX,
      moveY,
      lineX,
      lineY,
      color: '#d3d3d3'
    })
    console.log(_points.map(point => point.code), x, y)
  }

  c.addEventListener('mousemove', mouseMove)
}

setInterval(() => {
  
}, 100)
