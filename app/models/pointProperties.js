var mongoose = require('mongoose'),
        Schema = mongoose.Schema;

var PointPropertiesSchema = new Schema({
    type: String,
    name: String,
    description: String,
    smallIcon: String,
    bigIcon: String,
    accessLevel: {type:Number},
    maxXp: {type:Number},
    coolDown: {type:Number},
    lastPerformed: {type:Date},
    actionRadius: {type: Number}
});

mongoose.model('PointProperties', PointPropertiesSchema);