var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var _ = require('underscore');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var socketioJwt = require('socketio-jwt');
var jwtSecret = 'jkfdosajkovdiosavos';

var clients = [];
var sid = 1;

app.use(bodyParser.json()); // for parsing application/json

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.post('/login', function (req, res) {
  
  var password = 'admin1234'

  // TODO: validate the actual user
  var profile = {
    name: req.body.username,
    id: sid++
  }
  
  if(true) {
    // we are sending the profile in the token
    //console.info('auth successed')
    var token = jwt.sign(profile, jwtSecret, { expiresInMinutes: 60*5 });
    res.json({token: token}); // res.status(401).end(); 
  } else {
    //console.info('auth failed')
    res.status(401).end(); 
  }
  
})

io.use(socketioJwt.authorize({
  secret: jwtSecret,
  handshake: true
}))

// io represente toute les sockets
io.on('connection', function(socket){
  // la socket recue represente le client qui vient de se connecte
  console.log(socket.decoded_token.name, ' connected! (id=' + socket.id + ')');
  /*
  clients.push(socket);
  console.info(_.size(clients))
  */
  var data = {
    id: socket.decoded_token.id,
    name: socket.decoded_token.name
  }
  io.emit('membre connect', data)
  
  /*
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
    console.info(msg)
  });
  socket.on('action perso', function(id){
    console.info('action perso (id='+id+')')
  })
  */
  
  socket.on('want close', function(){
    var data = {
      id: socket.decoded_token.id,
      name: socket.decoded_token.name
    }
    io.emit('membre disconnect', data)
    socket.disconnect()
  })
  
  // When socket disconnects, remove it from the list:
  socket.on('disconnect', function() {
    // remove socket from clients
    /*var index = clients.indexOf(socket);
    if (index > -1) {
      clients.splice(index, 1);
    }
    console.info(_.size(clients))*/
    console.log(socket.decoded_token.name, ' disconnect! (id=' + socket.id + ')')
    
  });
});

/*
io.on('make action', function(socket){
  _.each(clients, function(data){
    //console.info(data)
  })
})
*/


http.listen(3000, function(){
  console.log('listening on *:3000');
});
