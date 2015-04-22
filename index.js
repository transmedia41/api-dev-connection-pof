var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var _ = require('underscore');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var socketioJwt = require('socketio-jwt');
var jwtSecret = 'jkfdosajkovdiosavos';
var jwtSecret2 = '123456789fdsafdafs';

var clients = [];

app.use(bodyParser.json()); // for parsing application/json

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.post('/login', function (req, res) {
  
  var password = 'admin1234'

  // TODO: validate the actual user user
  var profile = {
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@doe.com',
    id: 123
  }
  
  if(req.body.username == 'joel' && req.body.password == 'admin1234') {
    // we are sending the profile in the token
    console.info('auth successed')
    var token = jwt.sign(profile, jwtSecret, { expiresInMinutes: 60*5 });
    res.json({token: token}); // res.status(401).end(); 
  } else {
    console.info('auth failed')
    res.status(401).end(); 
  }
  
});

io.use(socketioJwt.authorize({
  secret: jwtSecret,
  handshake: true
}));

// io represente toute les sockets
io.on('connection', function(socket){
  // la socket recue represente le client qui vient de se connecte
  console.log('hello! ', socket.decoded_token.first_name);
  //console.log(socket.handshake.decoded_token.email, 'connected');
  
  console.info('New client connected (id=' + socket.id + ').');
  clients.push(socket);
  console.info(_.size(clients))
  
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
    console.info(msg)
  });
  
  
  socket.on('action perso', function(id){
    console.info('action perso (id='+id+')')
  })
  
  // When socket disconnects, remove it from the list:
  socket.on('disconnect', function() {
    // remove socket from clients
    var index = clients.indexOf(socket);
    if (index > -1) {
      clients.splice(index, 1);
    }
    console.info(_.size(clients))
    console.info('Client gone (id=' + socket.id + ').');
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
