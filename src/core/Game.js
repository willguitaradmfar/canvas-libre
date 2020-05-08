window.Game = class {
  constructor (selector, events = [], options = {}) {
    const { innerWidth: width, innerHeight: height } = window

    this.events = events
    this.events.push('new-user')
    this.events.push('change-edges')
    this.events.push('on-cursor')

    this.raioEdge = 50
    this.lineWidth = 4
    this.pointWidth = 2
    this.options = options
    this.options.space = this.options.space || 50
    this.options.dimensao = this.options.dimensao || [width / this.options.space, height / this.options.space]

    const urlParams = new URLSearchParams(window.location.search)
    this.sala = urlParams.get('sala')

    this.listeners = {}

    this.users = []

    this.initAllClients().then(() => {
      this.target = document.querySelector(selector)
      this.target.setAttribute('width', width)
      this.target.setAttribute('height', height)
      this.ctx = this.target.getContext('2d')
      this.target.addEventListener('mousemove', this.onMouseMove.bind(this))
      this.target.addEventListener('click', this.onMouseClick.bind(this))
      this.generatePoints()
      this.connected()
      this.draw()
    })
  }

  initAllClients () {
    this.client = this.getClient()

    this.eventsClients = {
      client: this.client
    }

    for (const event of this.events) {
      this.eventsClients[event] = this.getClient()
    }

    return Promise.all(Object.keys(this.eventsClients).map(async event => {
      return new Promise(resolve => {
        this.eventsClients[event].on('connect', resolve)
      })
    }))
  }

  getClient () {
    return window.mqtt.connect('wss://test.mosquitto.org:8081')
  }

  connected () {
    console.log('Connected !')
  }

  subscribe (topic, fn) {
    if (!this.eventsClients[topic]) throw new Error(`Evento ${topic} não foi iniciado`)

    const clientSubscribe = this.eventsClients[topic]
    clientSubscribe.subscribe(`${this.sala}/${topic}`)
    clientSubscribe.on('message', function (topic, payload) {
      fn(JSON.parse(payload))
    })
  }

  publish (topic, obj) {
    this.client.publish(`${this.sala}/${topic}`, JSON.stringify(obj))
  }

  generatePoints () {
    this.points = []
    for (let c = 1; c <= this.options.dimensao[0]; c++) {
      for (let l = 1; l <= this.options.dimensao[1]; l++) {
        this.points.push({
          code: `C${c}L${l}`,
          coord: [c * this.options.space, l * this.options.space]
        })
      }
    }
  }

  clear () {
    this.ctx.clearRect(0, 0, this.target.width, this.target.height)
  }

  on (event, fn) {
    this.subscribe(event, (obj) => {
      return fn(obj)
    })
    this.listeners = this.listeners || {}
    this.listeners[event] = (obj) => {
      this.publish(event, obj)
    }
  }

  draw () {
    this.clear()
    for (const point of this.points) {
      this.drawPoint({
        color: 'black',
        x: point.coord[0],
        y: point.coord[1]
      })
    }

    if (this.cursor) {
      this.drawLine(this.cursor)
    }

    for (const user of this.users) {
      const edges = user.edges.map(edge => {
        return {
          from: this.points.find(point => point.code === edge[0]),
          to: this.points.find(point => point.code === edge[1])
        }
      })

      if (!edges.length) {
        continue
      }

      for (const edge of edges) {
        if (!edge.from || !edge.to) continue

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

  onMouseMove (event) {
    this.houverOrClick(event.offsetX, event.offsetY)
  }

  onMouseClick (event) {
    this.houverOrClick(event.offsetX, event.offsetY, true)
  }

  houverOrClick (x, y, isClick = false) {
    const _points = this.points.filter(point => {
      const distancia = Math.hypot((y - point.coord[1]), (x - point.coord[0]))
      return distancia < this.raioEdge
    })

    if (_points.length !== 2) {
      this.cursor = undefined
      this.draw()
      return
    }

    if (isClick) {
      let me = this.users.find(user => user.user === window.localStorage.getItem('nickname'))

      if (!me) {
        window.localStorage.setItem('nickname', window.localStorage.getItem('nickname') || window.prompt('Entre com o nickname'))
        window.localStorage.setItem('color', window.localStorage.getItem('color') || window.prompt('Entre com a cor'))

        me = {
          user: window.localStorage.getItem('nickname'),
          color: window.localStorage.getItem('color'),
          edges: []
        }
        this.users.push(me)

        if (this.listeners['new-user']) {
          this.listeners['new-user'](me)
        }
      }

      me.edges.push([_points[0].code, _points[1].code])

      if (this.listeners['change-edges']) {
        this.listeners['change-edges'](me)
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
      if (this.listeners['on-cursor']) {
        this.listeners['on-cursor'](_points)
      }
    }
    this.draw()
  }

  drawLine ({ moveX, moveY, lineX, lineY, color, lineWidth }) {
    this.ctx.beginPath()
    this.ctx.lineWidth = lineWidth || this.lineWidth
    this.ctx.moveTo(moveX, moveY)
    this.ctx.lineTo(lineX, lineY)
    this.ctx.strokeStyle = color
    this.ctx.stroke()
    this.ctx.closePath()
  }

  drawPoint ({ x, y, rad, sAng, eAng, color = 'blue' }) {
    this.ctx.beginPath()
    this.ctx.arc(x, y, this.pointWidth, 0, 2 * Math.PI, true)
    this.ctx.strokeStyle = color
    this.ctx.fill()
    this.ctx.closePath()
  }
}
