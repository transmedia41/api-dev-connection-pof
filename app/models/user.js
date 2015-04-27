// User model

var mongoose = require('mongoose'),
    Schema = mongoose.Schema

var UserSchema = new Schema({
  name: String,
  password: String,
  xp: { type: Number, min: 0, default: 0 },
  level: {type: Schema.Types.ObjectId, ref:'Rank'},
  documents: [{document_id: {type: Schema.Types.ObjectId, ref:'Document'}, yetVisited: Boolean}],
  sectors: [{sector_id: {type: Schema.Types.ObjectId, ref:'Sector'}, actionsPerformed: Number}],
  characters: [{character_id: {type: Schema.Types.ObjectId, ref:'Character'}, yetVisited: Boolean}]
})


mongoose.model('User', UserSchema)
