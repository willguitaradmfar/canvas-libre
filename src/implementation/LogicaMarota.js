window.LogicaMarota = class extends window.Game {
  constructor (args) {
    super(args, [
      'result-all-info',
      'get-all-info'
    ])

    this.blockView('Conectando no servidor ....')
  }

  connected () {
    this.getInfo()
    this.on('new-user', this.novoUsuario.bind(this))
    this.on('change-edges', this.novaJogada.bind(this))
  }

  getInfo () {
    this.subscribe('result-all-info', (users) => {
      console.log('subscribe >> result-all-info', users)
      this.unblockView()
      if (!users.length) return
      this.users = window.deepmerge(this.users, users)
      this.draw()
    })

    this.subscribe('get-all-info', () => {
      console.log('subscribe >> get-all-info')
      this.publish('result-all-info', this.users)
      console.log('publish >> result-all-info')
    })
    this.publish('get-all-info', {})
    console.log('publish >> get-all-info')
  }

  novoUsuario (user) {
    if (this.users.find(_user => _user.user === user.user)) {
      return console.warn(`Usuário (${user.user}) já presente`)
    }
    this.users.push(user)
    this.draw()
  }

  novaJogada (user) {
    const _user = this.users.find(_user => _user.user === user.user)

    if (!_user) {
      this.novoUsuario(user)
    }

    for (let _user of this.users) {
      if (_user.user === user.user) {
        _user.edges = window.deepmerge(_user.edges, user.edges)
        this.draw()
        return
      }
    }
  }

  blockView (message) {
    if (message) {
      document.querySelector('#display').innerText = message
    }

    document
      .querySelector('#lock')
      .setAttribute('style', `
        background-color: coral;
        width: 100%;
        height: 100%;
        float: left;
        position: absolute;
        opacity: 0.2;
        z-index: 100;
    `)
    document
      .querySelector('#display')
      .setAttribute('style', `
        display: block;
    `)
  }

  unblockView (message) {
    if (message) {
      document.querySelector('#display').innerText = message
    }

    document
      .querySelector('#lock')
      .setAttribute('style', `
        background-color: yellowgreen;
        width: 100%;
        height: 100%;
        float: left;
        position: absolute;
        opacity: 0.2;
        z-index: -100;
    `)

    document
      .querySelector('#display')
      .setAttribute('style', `
        display: none;
    `)
  }
}
