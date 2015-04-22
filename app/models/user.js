// User model

var mongoose = require('mongoose'),
    Schema = mongoose.Schema

var UserSchema = new Schema({
  firstname: String,
  lastname: String,
  phone: String,
  roles: [ String ]
})


mongoose.model('User', UserSchema)