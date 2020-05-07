const lineWidth = 10

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

function * generateId () {
  while (true) {
    const random = Math.floor(Math.random() * Date.now() + 1)
    yield random
  }
}

class Canvas {
  constructor ({ ctx, startX = 0, startY = 0, color = 'black', user }) {
    this.ctx = ctx
    this.moveX = startX
    this.moveY = startY
    this.lineX = 0
    this.lineY = 0
    this.color = color
    this.user = user || `anonymous_${generateId().next().value}`
  }

  draw ({ edges }) {
    if (!edges.length) {
      throw new Error('empty edges')
    }
    if (edges.length === 1) {
      this.moveX = 0
      this.moveY = 0
    } else {
      const edg = edges[0]
      this.moveX = edg[0]
      this.moveY = edg[1]
      edges.shift()
    }

    edges.map(edge => {
      this.lineX = edge[0]
      this.lineY = edge[1]
      drawLine({
        ctx: this.ctx,
        moveX: this.moveX,
        moveY: this.moveY,
        lineX: this.lineX,
        lineY: this.lineY,
        color: this.color
      })
      this.moveX = this.lineX
      this.moveY = this.lineY
    })
    return this
  }

  toString () {
    console.log(this.user)
    return this.user
  }
}

const draw = obj => {
  const c = document.getElementById('canvasLibre')
  const ctx = c.getContext('2d')

  obj.data.map(item => {
    new Canvas({
      ctx,
      color: item.color,
      user: item.user
    })
      .draw({
        edges: item.edges
      })
      .toString()
  })
}
