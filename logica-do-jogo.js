class LogicaMarota extends Game {
 constructor(args) {
   super(args)

   this.connect()
 }

 connected(){
    this.getInfo()
    this.on('new-user', this.novoUsuario.bind(this))
    this.on('change-edges', this.novaJogada.bind(this))
 }

 getInfo(){
   this.subscribe('result-all-info',(users) => {
     console.log('subscribe >> result-all-info');
     
    this.users = users
    this.draw()
   })

   this.subscribe('get-all-info',() => {
     console.log('subscribe >> get-all-info');
     this.publish('result-all-info', this.users)
     console.log('publish >> result-all-info');   
  })

  setTimeout(() => {
    this.publish('get-all-info', {})
    console.log('publish >> get-all-info');
  }, 1000 *5)
 }

 novoUsuario(user){
  if(this.users.find(_user => _user.user === user.user)){
    return console.warn(`Usuário (${user.user}) já presente`)
  }
  this.users.push(user)
  this.draw()
 }

 novaJogada(user){
  for(let _user of this.users) {
    if(_user.user === user.user){
      _user.edges = deepmerge(_user.edges, user.edges)
      this.draw()
      return
    }
  }
 }
}