// ******** Game Core ********
/**
 * Module contenant les méthodes core de la logique du
 * jeu.
 */

var _ = require('underscore'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Sector = mongoose.model('Sector'),
    Event = mongoose.model('Event'),
    Document = mongoose.model('Document'),
    Rank = mongoose.model('Rank')

/**
 * NOT YET IMPLEMENTED
 */
function hasNewDocuments (player, socket, callback) {
  // ...
  getDocuments(player, function(err, data){
    if(err) console.log(err)
    //console.log(data)
    var listPlayerDocuments = _.map(player.documents, function(doc){ return doc.document_id })
    var listDocuments = _.map(data, function(doc){ return doc._id }) // list des documents disponibles
    _.each(listDocuments, function(newDocPossible){
      var test = _.find(listPlayerDocuments, function(docAlreadyAdded){ 
        //console.log(typeof docAlreadyAdded.toString(), typeof newDocPossible.toString())
        return docAlreadyAdded.toString() == newDocPossible.toString()
      })
      if(typeof test == 'undefined') {
        // nouveau document disponible
        var newDoc = {
          document_id: newDocPossible,
          yetVisited: false
        }
        console.log(newDoc)
        // on l'ajoute a la liste du joueur en non vu
        player.documents.push(newDoc)
      }
      
    })
    
    player.save(function(err, playerSaved) {
      console.log(getDocumentsNotYetVisited(playerSaved))
      callback(playerSaved)
    })
  })
}

function getDocuments (player, callback) {
  // ...
  //console.log(player)
  //callback(player)
  
  if (player != null) {
    Document.find({ xp: { $lte: player.xp } })
      .exec(function(err, data){
        callback(err, data)
      })
  } else {
    callback(null, null)
  }
}

function getDocumentsNotYetVisited (player) {
  if (player != null) {
    return _.size(_.where(player.documents, { yetVisited: false }))
  } else {
    return 0
  }
}


module.exports = {
  
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
  
  updateInfluence: function(action, sector, player, callback) {
    var down = this._getInfluence(action, sector, player)
    var newInfluence = Math.max(sector.properties.influence - down, 0)
    sector.properties.influence = newInfluence
    sector.save()
    callback(sector)
  },
  
  _getInfluence: function(action, sector, player) {
    return 5
  },
  
  updateXP: function(action, sector, player, socket, callback) {
    var newXP = this._getXP(action, sector, player)
    player.xp += newXP
    this.getRank(player, function(err, rank){
      if(err) console.log(err)
      if(player.level.level != rank.level) {
        player.level = rank._id
      }
      player.save(function(err, playerSaved) {
        hasNewDocuments(playerSaved, socket, function(playerUpdated){
          callback(playerUpdated)
        })
      })
    })
  },
  
  _getXP: function(action, sector, player) {
    return 15
  }
  
  
  
}