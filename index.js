var express = require('express'),
    glob = require('glob'),
    config = require('./config/config'),
    mongoose = require('mongoose')


mongoose.connect(config.db);
var db = mongoose.connection;
db.on('error', function () {
  throw new Error('unable to connect to database at ' + config.db);
});


var models = glob.sync(config.root + '/app/models/*.js');
models.forEach(function (model) {
  require(model);
})


var app = express()
http = require('http').Server(app)
http.listen(3000, function(){
  console.log('listening on *:3000');
})

require('./config/express')(app, config)
require('./app/sockets/socket')(app, http)


