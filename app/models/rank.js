// Rank model

var mongoose = require('mongoose'),
    Schema = mongoose.Schema

var RankSchema = new Schema({
  level: Number,
  rankName: String,
  xp: Number,
  xpMax: Number,
  msg: String
})

mongoose.model('Rank', RankSchema)