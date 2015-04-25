var config = require('../../config/config'),
    _ = require('underscore'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Sector = mongoose.model('Sector'),
    Event = mongoose.model('Event'),
    Converter = require('../services/converter'),
    socketioJwt = require('socketio-jwt')




/*
// send to current request socket client
socket.emit('message', "this is a test");

// sending to all clients, include sender
io.sockets.emit('message', "this is a test");

// sending to all clients except sender
socket.broadcast.emit('message', "this is a test");

// sending to all clients in 'game' room(channel) except sender
socket.broadcast.to('game').emit('message', 'nice game');

// sending to all clients in 'game' room(channel), include sender
io.sockets.in('game').emit('message', 'cool game');

// sending to individual socketid
io.sockets.socket(socketid).emit('message', 'for your eyes only');
*/



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
    console.log(socket.decoded_token.username, ' connected! (id=' + socket.id + ')')
    clients[socket.decoded_token.id] = socket
    
    if(typeof _.findWhere(users, {_id: socket.decoded_token.id}) == 'undefined') {
      users.push(socket.decoded_token)
    }
    
    //socket.broadcast.emit('membre connect', socket.decoded_token)
    
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
    
    //console.log(clients)
      /*_.each(users, function(data) {
        console.log(data)
      })*/
    
    socket.on('get user', function(){
      User.findById(socket.decoded_token.id).exec(function(err, res){
        if(!err) socket.emit('user responce', Converter.user(res))
        else socket.emit('user responce 404')
      })
    })
    
    socket.on('get sectors', function(){
      Sector.find().populate('properties.character properties.actionsPoint properties.actionsPolygon').exec(function(err, res){
        if(!err) socket.emit('sectors responce', res)
        else socket.emit('sectors responce 404')
      })
    })
    
    socket.on('get events', function(){
      Event.find().populate('documents').exec(function(err, res){
        if(!err) socket.emit('events responce', res)
        else socket.emit('events responce 404')
      })
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
      io.emit('membre disconnect', socket.decoded_token)
      console.log(socket.decoded_token.username, ' disconnect! (id=' + socket.id + ')')

    })
  })
  
  io.disconnectUser = function(id){
    clients[id].disconnect()
    delete clients[id]
    users.splice(users.indexOf(_.findWhere(users, {_id: id})), 1)
  }
  
}

