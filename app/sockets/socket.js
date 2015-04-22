var config = require('../../config/config'),
    _ = require('underscore'),
    socketioJwt = require('socketio-jwt')

module.exports = function (app, http) {
  
  var clients = []
  var users = []
  
  io = require('socket.io')(http)
  
  io.use(socketioJwt.authorize({
    secret: config.jwtSecret,
    handshake: true
  }))

  // io represente toute les sockets
  io.on('connection', function(socket){
    // la socket recue represente le client qui vient de se connecte
    console.log(socket.decoded_token.name, ' connected! (id=' + socket.id + ')')
    clients[socket.decoded_token._id] = socket
    
    if(typeof _.findWhere(users, {_id: socket.decoded_token._id}) == 'undefined') {
      users.push(socket.decoded_token)
    }
    
    /*
    clients.push(socket);
    console.info(_.size(clients))
    */
    /*var data = {
      _id: socket.decoded_token._id,
      name: socket.decoded_token.name
    }
    io.emit('membre connect', data)
    */
    
    socket.on('get member list', function(){
      //console.log(clients)
      /*_.each(users, function(data) {
        console.log(data)
      })*/
      socket.emit('member list', users)
    })

    /*
    socket.on('chat message', function(msg){
      io.emit('chat message', msg);
      console.info(msg)
    });
    socket.on('action perso', function(id){
      console.info('action perso (id='+id+')')
    })
    */
/*
    socket.on('want close', function(){
      var data = {
        _id: socket.decoded_token._id,
        name: socket.decoded_token.name
      }
      io.emit('membre disconnect', data)
      socket.disconnect()
    })*/

    // When socket disconnects, remove it from the list:
    socket.on('disconnect', function() {
      // remove socket from clients
      /*var index = clients.indexOf(socket);
      if (index > -1) {
        clients.splice(index, 1);
      }
      console.info(_.size(clients))*/
      console.log(socket.decoded_token.name, ' disconnect! (id=' + socket.id + ')')

    })
  })
  
  io.disconnectUser = function(id){
    clients[id].disconnect()
    delete clients[id]
    users.splice(users.indexOf(_.findWhere(users, {_id: id})), 1)
  }
  
}

