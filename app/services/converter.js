// Converter
var _ = require('underscore')


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
        xpMax: rank.xpMax,
        level: rank.level
      }
    } else {
      return null
    }
  },
  
  sector: function(sector) {
    if (sector != null) {
      var sectors = []
      _.each(sector, function(value) {
        
        console.log(value)
        
        sectors.push({
          id: value._id,
          type: value.type,
          geometry: {
            type: value.geometry.atype,
            coordinates: value.geometry.coordinates
          },
          properties: {
            nbActions: value.properties.nbActions,
            influence: value.properties.influence,
            nomsquart: value.properties.nomsquart,
            character: this.character(value.properties.character),
            actionsPolygon: this.actionPolygonArray(value.properties.actionsPolygon),
            actionsPoint: this.actionPointArray(value.properties.actionsPoint)
          }
        })
      }, this)
      return sectors
    } else {
      return null
    }
  },
  
  sectorUnique: function(sector) {
    if (sector != null) {
      return {
        id: sector._id,
        type: sector.type,
        geometry: {
          type: sector.geometry.atype,
          coordinates: sector.geometry.coordinates
        },
        properties: {
          nbActions: sector.properties.nbActions,
          influence: sector.properties.influence,
          nomsquart: sector.properties.nomsquart,
          character: this.character(sector.properties.character),
          actionsPolygon: this.actionPolygonArray(sector.properties.actionsPolygon),
          actionsPoint: this.actionPointArray(sector.properties.actionsPoint)
        }
      }
    } else {
      return null
    }
  },
  
  characterArray: function(character) {
    if (character != null) {
      var characters = []
      _.each(character, function(value) {
        characters.push(this.character(value))
      }, this)
      return characters
    } else {
      return null
    }
  },
  
  character: function(character) {
    if (character != null) {
      return {
        id: character._id,
        status: character._id,
        lastname: character.lastname,
        firstname: character.firstname,
        nickname: character.nickname,
        life: character.life,
        personality: character.personality,
        twitch: character.twitch,
        vice: character.vice,
        drink: character.drink,
        strength: character.strength,
        weakness: character.weakness,
        distinctive: character.distinctive,
        body: character.body,
        family: character.family,
        weapon: character.weapon
      }
    } else {
      return null
    }
  },
  
  actionPolygonArray: function(actionPolygon) {
    if (actionPolygon != null) {
      var actionsPolygon = []
      _.each(actionPolygon, function(value) {
        actionsPolygon.push(this.actionPolygon(value))
      }, this)
      return actionsPolygon
    } else {
      return null
    }
  },
  
  actionPolygon: function(ap) {
    if (ap != null) {
      return {
        id: ap._id,
        type: ap.type,
        name: ap.name,
        description: ap.description,
        icon: ap.icon,
        accessLevel: ap.accessLevel,
        maxXp: ap.maxXp,
        coolDown: ap.coolDown,
        lastPerformed: ap.lastPerformed,
        influence: ap.influence
      }
    } else {
      return null
    }
  },
  
  actionPointArray: function(actionPoint) {
    if (actionPoint != null) {
      var actionsPoint = []
      _.each(actionPoint, function(value) {
        actionsPoint.push(this.actionPoint(value))
      }, this)
      return actionsPoint
    } else {
      return null
    }
  },
  
  actionPoint: function(ap) {
    if (ap != null) {
      return {
        id: ap._id,
        type: ap.type,
        geometry: {
          type: ap.geometry.atype,
          coordinates: ap.geometry.coordinates
        },
        properties: {
          type: ap.properties.atype,
          name: ap.properties.name,
          description: ap.properties.description,
          icon: ap.properties.smallIcon,
          accessLevel: ap.properties.accessLevel,
          maxXp: ap.properties.maxXp,
          influence: ap.properties.influence,
          coolDown: ap.properties.coolDown,
          lastPerformed: ap.properties.lastPerformed,
          actionRadius: ap.properties.actionRadius
        }
      }
    } else {
      return null
    }
  }
  
}