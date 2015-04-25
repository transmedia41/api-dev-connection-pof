// User model

var mongoose = require('mongoose'),
    Schema = mongoose.Schema

var UserSchema = new Schema({
  name: String,
  password: String,
  xp: { type: Number, min: 0, default: 0 }
})


mongoose.model('User', UserSchema)
