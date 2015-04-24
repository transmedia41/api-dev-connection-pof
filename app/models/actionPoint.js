var mongoose = require('mongoose'),
        Schema = mongoose.Schema;

var ActionPointSchema = new Schema({
    type: String,
    geometry: {
        atype: String,
        coordinates: []
    },
    properties: {
        atype: String,
        name: String,
        description: String,
        smallIcon: String,
        bigIcon: String,
        accessLevel: {type: Number},
        maxXp: {type: Number},
        coolDown: {type: Number},
        lastPerformed: {type: Date},
        actionRadius: {type: Number}
    }
});

mongoose.model('ActionPoint', ActionPointSchema);