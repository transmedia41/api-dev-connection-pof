var app = require('express')(),
    http = require('http').Server(app),
    config = require('./config/config')


require('./config/express')(app, config)
require('./app/sockets/socket')(app, http)


http.listen(3000, function(){
  console.log('listening on *:3000');
});
