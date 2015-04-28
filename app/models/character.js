var mongoose = require('mongoose'),
        Schema = mongoose.Schema;

var CharacterSchema = new Schema({
    char_id: Number,
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
    weapon: String,
    portrait: String,
    sectorDescription: String
});

mongoose.model('Character', CharacterSchema);