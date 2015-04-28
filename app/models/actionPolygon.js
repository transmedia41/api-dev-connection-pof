var mongoose = require('mongoose'),
        Schema = mongoose.Schema;

var ActionPolygonSchema = new Schema({
    name: String,
    type: String,
    description: String,
    icon: String,
    accessLevel: Number,
    maxXp: Number,
    coolDown: Number,
    influence: Number,
    lastPerformed: { type: Number, min: 0, default: 0 }
});

mongoose.model('ActionPolygon', ActionPolygonSchema);