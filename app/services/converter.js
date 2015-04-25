// Converter

module.exports = {
  
  user: function(user) {
    if (user != null) {
      return {
        id: user._id,
        username: user.name,
        xp: user.xp
      }
    } else {
      return null
    }
  },
  
  userFull: function(user) {
    if (user != null) {
      return {
        id: user._id,
        username: user.name,
        xp: user.xp,
        level: this.rank(user.level)
      }
    } else {
      return null
    }
  },
  
  rank: function(rank) {
    if (rank != null) {
      return {
        id: rank._id,
        rankName: rank.rankName,
        xp: rank.xp,
        xpMax: rank.xpMax
      }
    } else {
      return null
    }
  }
  
}