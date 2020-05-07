class Game {
  constructor(selector, options = {}){
    this.raioEdge = 40
    this.lineWidth = 4
    this.pointWidth = 2
    this.options = options
    this.options.dimensao = this.options.dimensao || [10, 10]
    this.options.space = this.options.space || 50
    this.generatePoints()
    
    this.target = document.querySelector(selector)
    this.ctx = this.target.getContext('2d')
    this.target.addEventListener('mousemove', this.onMouseMove.bind(this))
    this.target.addEventListener('click', this.onMouseClick.bind(this))
  }

  generatePoints(){
    this.points = []
    for(let c = 1 ; c <= this.options.dimensao[0] ; c++){
      for(let l = 1 ; l <= this.options.dimensao[1] ; l++){
        this.points.push({
          code: `C${c}L${l}`,
          coord: [c*this.options.space, l*this.options.space]
        })
      }
    }
  }

  setUsers(users){
    this.users = users
    this.draw()
  }

  clear(){
    this.ctx.clearRect(0, 0, this.target.width, this.target.height);
  }

  on(event, fn){
    this.listeners = this.listeners || {}
    this.listeners[event] = fn
  }

  draw(){
    this.clear()
    for(const point of this.points){
      this.drawPoint({ 
        ctx: this.ctx, 
        color: 'black', 
        x: point.coord[0], 
        y: point.coord[1] 
      })
    }

    if(this.cursor) {
      this.drawLine(this.cursor)
    }

    for(const user of this.users) {

      const edges = user.edges.map(edge => {
        return {
          from: this.points.find(point => point.code === edge[0]),
          to: this.points.find(point => point.code === edge[1])
        }
      })

      if (!edges.length) {
        return
      }

      for(const edge of edges) {
        if(!edge.from || !edge.to) continue

        const moveX = edge.from.coord[0]
        const moveY = edge.from.coord[1]

        const lineX = edge.to.coord[0]
        const lineY = edge.to.coord[1]

        this.drawLine({
          moveX,
          moveY,
          lineX,
          lineY,
          color: user.color
        })
      }
    }
  }

  onMouseMove(event) {
    this.houverOrClick(event.offsetX, event.offsetY)
  }

  onMouseClick(event) {
    this.houverOrClick(event.offsetX, event.offsetY, true)
  }

  houverOrClick(x, y, isClick = false) {
    const _points = this.points.filter(point => {
      const distancia = Math.hypot((x - point.coord[0]), (y - point.coord[1]))
      return distancia < this.raioEdge
    })

    if(_points.length !== 2) {
      this.cursor = undefined
      return
    }

    if(isClick) {
      let me = this.users.find(user => user.user === localStorage.getItem('nickname'))

      if(!me) {
        localStorage.setItem('nickname', localStorage.getItem('nickname') || prompt('Entre com o nickname'))
        localStorage.setItem('color', localStorage.getItem('color') || prompt('Entre com a cor'))
        
        me = {
          user: localStorage.getItem('nickname'),
          color: localStorage.getItem('color'),
          edges: []
        }
        this.users.push(me)

        if(this.listeners['new-user']) {
          this.listeners['new-user'](me)
        }        
      }

      me.edges.push([_points[0].code, _points[1].code])
      
      if(this.listeners['change-edges']) {
        this.listeners['change-edges'](this.users)
      }
   } else {
      const moveX = _points[0].coord[0]
      const moveY = _points[0].coord[1]

      const lineX = _points[1].coord[0]
      const lineY = _points[1].coord[1]

      this.cursor = {
        moveX,
        moveY,
        lineX,
        lineY,
        color: '#d3d3d3',
        lineWidth: 2
      }
      if(this.listeners['on-cursor']) {
        this.listeners['on-cursor'](_points)
      }
    }
    this.draw()
  }

  drawLine({ moveX, moveY, lineX, lineY, color, lineWidth }) {
    this.ctx.beginPath()
    this.ctx.lineWidth = lineWidth || this.lineWidth
    this.ctx.moveTo(moveX, moveY)
    this.ctx.lineTo(lineX, lineY)
    this.ctx.strokeStyle = color
    this.ctx.stroke()
    this.ctx.closePath()
  }

  drawPoint({ x, y, rad, sAng, eAng, color = 'blue' }) {
    this.ctx.beginPath()
    this.ctx.arc(x, y, this.pointWidth, 0, 2 * Math.PI, true);
    this.ctx.strokeStyle = color
    this.ctx.fill()
    this.ctx.closePath()
  }
}