var express = require('express'),
    glob = require('glob'),
    cors = require('cors'),
    config = require('./config/config'),
    mongoose = require('mongoose')


mongoose.connect(config.db);
var db = mongoose.connection;
db.on('error', function () {
  throw new Error('unable to connect to database at ' + config.db);
})


var models = glob.sync(config.rootPath + '/app/models/*.js');
models.forEach(function (model) {
  require(model);
})


var app = express()
app.use(cors())
app.use(express.static('public'))

http = require('http').Server(app)
http.listen(3000, function(){
  console.log('listening on *:3000')
})

require('./app/sockets/socket')(app, http)
require('./config/express')(app, config)

var GameCore = require('./app/services/gameCore')
setInterval(GameCore.updateSectorsInfluence, 3600000)
