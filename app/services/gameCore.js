// ******** Game Core ********
/**
 * Module contenant les méthodes core de la logique du
 * jeu.
 */

var _ = require('underscore'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Rank = mongoose.model('Rank')


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
  }
  
}