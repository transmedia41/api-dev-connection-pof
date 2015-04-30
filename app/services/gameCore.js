
// ***************************
// ******** Game Core ********
// ***************************

/**
 * Module contenant les méthodes core de la logique du
 * jeu.
 * 
 * @author: Joel Gugger
 * v1.0
 */

var _ = require('underscore'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Sector = mongoose.model('Sector'),
    Event = mongoose.model('Event'),
    Document = mongoose.model('Document'),
    Rank = mongoose.model('Rank'),
    Character = mongoose.model('Character'),
    Converter = require('./converter')



/**
 * Met à jour la liste si de nouveaux documents sont
 * disponible pour le joueur
 *
 * Peut emmetre 'new documents'
 */
function hasNewDocuments (player, socket, callback) {
  console.log("hasNewDocuments est appelée")
  getDocuments(player, function(err, data){
    if(err) console.log(err)
    console.log("data", data)
    console.log("player", player)
    var listPlayerDocuments = _.map(player.documents, function(doc){ return doc.document_id })
    console.log("listPlayerDocuments", listPlayerDocuments)
    var listDocuments = _.map(data, function(doc){ return doc._id })
    console.log("listDocuments", listDocuments)
    _.each(listDocuments, function(newDocPossible){
      var test = _.find(listPlayerDocuments, function(docAlreadyAdded) {
        return docAlreadyAdded.toString() == newDocPossible.toString()
      })
      if(typeof test == 'undefined') {
        var newDoc = {
          document_id: newDocPossible,
          yetVisited: false
        }
        player.documents.push(newDoc)
        console.log("pushed new doc in player document list ")
        socket.emit('new documents')
      }
    })
    player.save(function(err, playerSaved) {
      var count = getDocumentsNotYetVisited(playerSaved)
      socket.emit('update document count', count)
      callback(playerSaved)
    })
  })
}


/**
 * Récupere la liste des documents disponible pour le joueur
 * 
 */
function getDocuments (player, callback) {
  if (player != null) {
    Document.find({ xp: { $lte: player.xp } })
      .exec(function(err, data){
        callback(err, data)
      })
  } else {
    callback(null, null)
  }
}


/**
 * Récupere la liste des documents du joueur qu'il
 * n'a pas encore regarder
 * 
 */
function getDocumentsNotYetVisited (player) {
  if (player != null) {
    return _.size(_.where(player.documents, { yetVisited: false }))
  } else {
    return 0
  }
}


function getCharactersNotYetVisited (player) {
  if (player != null) {
    return _.size(_.where(player.characters, { yetVisited: false }))
  } else {
    return 0
  }
}

module.exports = {
  
  _getInfluence: function(action, sector, player) {
    var influence;
    if (action.type === "Feature") {
      influence = action.properties.influence
    } else {
      influence = action.influence
    }
    console.log(influence)
    return influence
  },
  
  _getXP: function(action, sector, player) {
    var xpMin;
    if (action.type === "Feature") {
      xpMin = action.properties.accessLevel
    } else {
      xpMin = action.accessLevel
    }
    var influence = sector.properties.influence
    return Math.ceil(xpMin * ( 1 + (influence * 0.6 / 100)))
  },
  
  
  
  /**
   * Retourne l'objet rank qui doit être lié au joueur
   * passé en parametre.
   * @callback: fonction executée lorsque le rank à été trouver
   *            prend en parametre: (err, data)
   */
  getRank: function(user, callback) {
    if (user != null) {
      Rank.findOne({ xp: { $lte: user.xp }, xpMax: { $gte: user.xp } })
        .exec(function(err, data){
          callback(err, data)
        })
    } else {
      callback(null, null)
    }
  },
  
  
  /**
   * Met à jour l'influence du secteur passer en parametre
   * selon le joueur et l'action associcée
   * Prend un callback quand l'opération est terminée
   * retourne le secteur sauver
   */
  updateInfluence: function(action, sector, player, callback) {
    var down = this._getInfluence(action, sector, player)
    var newInfluence = Math.max(sector.properties.influence - down, 0)
    sector.properties.influence = newInfluence
    sector.save(function(err, sectorSaved){
      callback(sectorSaved)
    })
  },
  
  
  /**
   * Met à jour l'experience du joueur en fonction de l'action et
   * du secteur de celle-ci
   * Prend un callback en parametre avec le joueur mis à jour et
   * le nombre de nouvaux documents disponible
   *
   * Peut emmetre 'new rank'
   */
  updateXP: function(action, sector, player, socket, callback) {
    var newXP = this._getXP(action, sector, player)
    player.xp += newXP
    this.getRank(player, function(err, rank){
      if(err) console.log(err)
      if(player.level.level != rank.level) {
        player.level = rank._id
        socket.emit('new rank')
      }
      player.save(function(err, playerSaved) {
        hasNewDocuments(playerSaved, socket, function(playerUpdated){
          callback(playerUpdated)
        })
      })
    })
  },
  
  
  /**
   * Met à jour le nombre d'action faite par le joueur dans le secteur
   * donner.
   * Débloque le charactère lié si le nombre d'actions nécessaire est
   * atteint
   *
   * Peut emmetre 'new character'
   */
  updateNbActionToPerformedInSector: function(action, sector, player, socket, callback) {
    var test = _.find(player.sectors, function(sectorPlayer){
      return sectorPlayer.sector_id.toString() == sector._id.toString()
    })
    if(typeof test == 'undefined') {
      var newSector = {
        sector_id: sector._id.toString(),
        actionsPerformed: 1
      }
      player.sectors.push(newSector)
    } else {
      var sectPlayer
      _.each(player.sectors, function(sect) {
        if(sect.sector_id.toString() == sector._id.toString()) {
          sect.actionsPerformed++
          sectPlayer = sect
          return true
        }
      })
      if(sectPlayer.actionsPerformed == sector.properties.nbActions) {
        var newCharacter = {
          character_id: sector.properties.character.toString(),
          yetVisited: false
        }
        player.characters.push(newCharacter)
        socket.emit('new character')
      } else if (player.xp >= 1550) {
        Character.findOne().where('char_id').equals(1).exec(function(err, res){
          var newCharacter = {
            character_id: res._id,
            yetVisited: false
          }
          player.characters.push(newCharacter)
          socket.emit('new character')
        })
      }
    }
    player.save(function(err, playerSaved) {
      socket.emit('update character count', getCharactersNotYetVisited(playerSaved))
      callback(playerSaved)
    })
  },
  
  getCharactersNotYetVisited: function (player) {
    return getCharactersNotYetVisited(player)
  },
  
  getDocumentsNotYetVisited: function (player) {
    return getDocumentsNotYetVisited(player)
  },
  
  makeActionPolygon: function(action, callback) {
    action.lastPerformed = Math.round((new Date()).getTime() / 1000)
    action.save(function(err, actionSaved) {
      callback(actionSaved)
    })
  },
  
  
  /**
   * Met à jour l'influence des secteurs
   * Cette fonction est appelée par un set interval
   *
   */
  updateSectorsInfluence: function() {
    Sector.find()
      .exec(function(err, res){
        _.each(res, function(sector, key){
          var newInfluence = Math.min(sector.properties.influence+1, 100)
          sector.properties.influence = newInfluence
          sector.save()
        })
      Sector.find()
        .populate('properties.character')
        .populate('properties.actionsPoint')
        .populate(' properties.actionsPolygon').exec(function(err, res){
          io.sockets.emit('update sectors influence', Converter.sector(res))
      })
    })
  },
  
  hasNewDocuments: function(player, socket, callback) {
    hasNewDocuments(player, socket, callback)
  }
  
}
