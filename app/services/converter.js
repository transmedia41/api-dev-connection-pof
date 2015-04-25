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
  }
  
}