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
        icon: String,
        accessLevel: {type: Number},
        maxXp: {type: Number},
        influence: {type: Number},
        coolDown: {type: Number},
        lastPerformed: {type: Number},
        actionRadius: {type: Number}
    }
});

mongoose.model('ActionPoint', ActionPointSchema)