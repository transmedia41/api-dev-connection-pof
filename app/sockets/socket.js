var config = require('../../config/config'),
    _ = require('underscore'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Sector = mongoose.model('Sector'),
    Event = mongoose.model('Event'),
    ActionPolygon = mongoose.model('ActionPolygon'),
    Character = mongoose.model('Character'),
    ActionPoint = mongoose.model('ActionPoint'),
    Converter = require('../services/converter'),
    GameCore = require('../services/gameCore'),
    socketioJwt = require('socketio-jwt'),
    Geolib = require('geolib')



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
  var desktop = []
  var mobile = []
  
  io = require('socket.io')(http)
  
  io.use(socketioJwt.authorize({
    secret: config.jwtSecret,
    handshake: true
  }))
  
  io.on('connection', function(socket){
    console.log(socket.decoded_token.username, ' connected on '+socket.decoded_token.plateform+'! (id=' + socket.id + ')')
    if(typeof clients[socket.decoded_token.id] == 'undefined') {
      clients[socket.decoded_token.id] = []
      clients[socket.decoded_token.id][socket.decoded_token.plateform] = socket
    } else {
      clients[socket.decoded_token.id][socket.decoded_token.plateform] = socket
    }
    if(socket.decoded_token.plateform == 'desktop'){
      desktop.push(socket)
    } else {
      mobile.push(socket)
    }
    
    function broadcastDesktop(name, data) {
      _.each(desktop, function(socket){
        socket.emit(name, data)
      })
    }
    
    function broadcastMobile(name, data) {
      _.each(mobile, function(socket){
        socket.emit(name, data)
      })
    }
    
    socket.on('get user', function(){
      User.findById(socket.decoded_token.id).populate('level').exec(function(err, res){
        if(!err) socket.emit('user responce', Converter.userFull(res))
        else socket.emit('user responce 404')
      })
    })
    
    socket.on('get users', function(){
      User.find().populate('level').exec(function(err, res){
        if(!err) { 
          var users = Converter.userFullArray(res)
          _.each(users, function(user, key){
            if(typeof clients[user.id] != 'undefined') {
              users[key]['connected'] = true
            } else {
              users[key]['connected'] = false
            }
          })
          socket.emit('users responce', users)
        } else { 
          socket.emit('users responce 404')
        }
      })
    })
    
    socket.on('get sectors', function(){
      Sector.find().populate('properties.character properties.actionsPoint properties.actionsPolygon').exec(function(err, res){
        if(!err) socket.emit('sectors responce', Converter.sector(res))
        else socket.emit('sectors responce 404')
      })
    })
    
    socket.on('get sectors light', function(){
      Sector.find().exec(function(err, res){
        if(!err) socket.emit('sectors light responce', Converter.sectorLight(res))
        else socket.emit('sectors light responce 404')
      })
    })
    
    socket.on('get action point', function(){
      ActionPoint.find().exec(function(err, res){
        if(!err) socket.emit('action point responce', Converter.actionPointArray(res))
        else socket.emit('action point responce 404')
      })
    })
    
    socket.on('get events', function(){
      Event.find().populate('documents').exec(function(err, res){
        if(!err) socket.emit('events responce', res)
        else socket.emit('events responce 404')
      })
    })
    
    socket.on('get character count', function(){
      User.findById(socket.decoded_token.id).exec(function(err, res){
        if(!err) socket.emit('character count responce', GameCore.getCharactersNotYetVisited(res))
        else socket.emit('character count 404')
      })
    })
    
    socket.on('get document count', function(){
      User.findById(socket.decoded_token.id).exec(function(err, res){
        if(!err) socket.emit('document count responce', GameCore.getDocumentsNotYetVisited(res))
        else socket.emit('document count 404')
      })
    })
    
    socket.on('has new document', function(){
      User.findById(socket.decoded_token.id).exec(function(err, res){
        if(!err) { 
          GameCore.hasNewDocuments(res, socket, function(playerSaved){})
        } else { socket.emit('has new document 404') }
      })
    })
    
    socket.on('character vu', function(data) {
      User.findById(socket.decoded_token.id).exec(function(err, res){
          _.each(res.characters, function(v) {
            if (v.character_id.toString() == data) v.yetVisited = true
          })
          res.save()
          if (!err) socket.emit('character count responce', GameCore.getCharactersNotYetVisited(res))
          else socket.emit('character count 404')
      })
    })
    
    socket.on('document vu', function(data) {
      User.findById(socket.decoded_token.id).exec(function(err, res){
          if (err) {
            socket.emit('document count 404')
          } else {
            _.each(res.documents, function(v) {
              if (v.document_id.toString() == data) v.yetVisited = true
            })
            res.save()
            socket.emit('document count responce', GameCore.getDocumentsNotYetVisited(res))
          }
      })
    })
    
    function createUnknownChar(i) {
      return {
        char_id: i,
        status: 'Inconnu',
        lastname: 'Inconnu',
        firstname: 'Inconnu',
        nickname: 'Inconnu',
        life: [],
        personality: 'Inconnu',
        twitch: 'Inconnu',
        vice: 'Inconnu',
        drink: 'Inconnu',
        strength: 'Inconnu',
        weakness: 'Inconnu',
        distinctive: 'Inconnu',
        body: 'Inconnu',
        family: 'Inconnu',
        weapon: 'Inconnu',
        portrait: 'portraits/unknown.png',
        sectorDescription: 'Inconnu',
        available: false
      }
    }

    socket.on('get my characters', function(){
      User.findById(socket.decoded_token.id).populate('characters.character_id').exec(function(err, res){
        var characters = []
        var counter = 0
        for(var i = 2; i <= 12; i++) {
          if (!_.find(res.characters, function(char){ return char.character_id.char_id == i })) {
            characters.push(createUnknownChar(i))
          } else {
            counter++
            var char = _.find(res.characters, function(char){ return char.character_id.char_id == i })
            char.character_id.available = true
            characters.push(char.character_id)
          }
        }
        if (res.xp >= 1550) {
          Character.findOne().where('char_id').equals(1).exec(function(err, res){
            var tab = []
            res.available = true
            tab[0] = res
            characters = _.union(tab, characters)
            characters = _.sortBy(characters, 'char_id')
            socket.emit('my characters responce', Converter.characterArray(characters))
          })
        } else {
          var tab = []
          tab[0] = createUnknownChar(1)
          characters = _.union(tab, characters)
          characters = _.sortBy(characters, 'char_id')
          socket.emit('my characters responce', Converter.characterArray(characters))
        }
      })
    })
    
    socket.on('get my documents', function(){
      User.findById(socket.decoded_token.id).exec(function(err, res){
        Event.find().where('xp').lte(res.xp).populate('documents').sort({order: 'asc'}).exec(function(err, res){
          socket.emit('my documents responce', Converter.eventArray(res))
        })
      })
    })
    
    socket.on('make action', function(data){
      ActionPolygon.findById(data.id).exec(function(err, resAction){
        if(err) {
          socket.emit('action error')
        } else {
          Sector.findById(data.sector_id).exec(function(err, resSector){
            if(err) {
              socket.emit('action error')
            } else {
              User.findById(socket.decoded_token.id).populate('level').exec(function(err, resPlayer){
                if(err) {
                  socket.emit('action error')
                } else {
                  if(resAction == null || resSector == null || resPlayer == null) {
                    socket.emit('action error')
                  } else {
                    if ((resAction.lastPerformed + resAction.coolDown) > Math.round((new Date()).getTime() / 1000)) {
                      socket.emit('action in cooldown')
                    } else {
                      GameCore.updateInfluence(resAction, resSector, resPlayer, function(updatedSector){
                        GameCore.updateXP(resAction, resSector, resPlayer, socket, function(updatedPlayer){
                          GameCore.updateNbActionToPerformedInSector(resAction, resSector, resPlayer, socket, function(){
                            GameCore.makeActionPolygon(resAction, function(actionPerformed){
                              Sector.findById(data.sector_id)
                                .populate('properties.character')
                                .populate('properties.actionsPoint')
                                .populate(' properties.actionsPolygon')
                                .exec(function(err, resSector){
                                  broadcastDesktop('action polygon performed', Converter.sectorUnique(resSector))
                              })
                              User.findById(socket.decoded_token.id).populate('level').exec(function(err, resPlayer){
                                socket.emit('user update', Converter.userFull(resPlayer))
                              })
                            })
                          })
                        })
                      })
                    }
                  }
                }
              })
            }
          })
        }
      })
    })
    
    
    socket.on('make action point', function(data){
      ActionPoint.findById(data.id).exec(function(err, resActionPoint){
        if(err) {
          socket.emit('action error')
        } else {
          Sector.findById(data.sector_id).exec(function(err, resSector){
            if(err) {
              socket.emit('action error')
            } else {
              User.findById(socket.decoded_token.id).populate('level').exec(function(err, resPlayer){
                if(err) {
                  socket.emit('action error')
                } else {
                  if(resActionPoint == null || resSector == null || resPlayer == null) {
                    socket.emit('action error')
                  } else {
                    console.log("resActionPoint", resActionPoint)
                    var latlng = data.position
                    console.log("latlng", latlng)
                    var center = {
                      longitude: resActionPoint.geometry.coordinates[0],
                      latitude: resActionPoint.geometry.coordinates[1]
                    }
                    console.log('center', center)
                    var radius = resActionPoint.properties.actionRadius
                    console.log('radius', radius)
                    var pointIsInCircle = Geolib.isPointInCircle(latlng, center, radius)
                    console.log('pointIsInCircle', pointIsInCircle)
                    if(!pointIsInCircle) {
                      socket.emit('not near action')
                    } else if ((resActionPoint.properties.lastPerformed + resActionPoint.properties.coolDown) > Math.round((new Date()).getTime() / 1000)) {
                      socket.emit('action in cooldown')
                    } else {
                      GameCore.updateInfluence(resActionPoint, resSector, resPlayer, function(updatedSector){
                        GameCore.updateXP(resActionPoint, resSector, resPlayer, socket, function(updatedPlayer){
                          GameCore.updateNbActionToPerformedInSector(resActionPoint, resSector, resPlayer, socket, function(){
                            GameCore.makeActionPoint(resActionPoint, function(actionPerformed){
                              broadcastMobile('action point performed', Converter.actionPoint(actionPerformed))
                              Sector.findById(data.sector_id)
                                .populate('properties.character')
                                .populate('properties.actionsPoint')
                                .populate(' properties.actionsPolygon')
                                .exec(function(err, resSector){
                                  broadcastDesktop('action polygon performed', Converter.sectorUnique(resSector))
                              })
                              User.findById(socket.decoded_token.id).populate('level').exec(function(err, resPlayer){
                                socket.emit('user update', Converter.userFull(resPlayer))
                              })
                            })
                          })
                        })
                      })
                    }
                  }
                }
              })
            }
          })
        }
      })
    })
    
    socket.on('disconnect', function() {
      io.emit('membre disconnect', socket.decoded_token)
      console.log(socket.decoded_token.username, ' disconnect on '+socket.decoded_token.plateform+'! (id=' + socket.id + ')')
    })
    
  })
  
  io.disconnectUser = function(decodedTocken){
    clients[decodedTocken.id][decodedTocken.plateform].disconnect()
    delete clients[decodedTocken.id][decodedTocken.plateform]
  }
  
}
