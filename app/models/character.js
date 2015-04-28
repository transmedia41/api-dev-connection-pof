var mongoose = require('mongoose'),
        Schema = mongoose.Schema;

var CharacterSchema = new Schema({
    status: String,
    lastname: String,
    firstname: String,
    nickname: String,
    life: [String],
    personality: String,
    twitch: String,
    vice: String,
    drink: String,
    strength: String,
    weakness: String,
    distinctive: String,
    body: String,
    family: String,
    weapon: String
});

mongoose.model('Character', CharacterSchema);