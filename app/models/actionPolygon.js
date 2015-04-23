var mongoose = require('mongoose'),
        Schema = mongoose.Schema;

var ActionPolygonSchema = new Schema({
    name: String,
    description: String,
    smallIcon: String,
    bigIcon: String,
    accessLevel: {type:Number},
    maxXp: {type:Number},
    coolDown: {type:Number},
    lastPerformed: {type:Date}
    
});

mongoose.model('ActionPolygon', ActionPolygonSchema);