var mongoose = require('mongoose'),
        Schema = mongoose.Schema;

var SectorSchema = new Schema({
    type: String,
    geometry: {
        atype: String,
        coordinates: []
    },
    properties: {
        nbActions: Number,
        influence: Number,
        nomsquart: String,
        character: {type: Schema.Types.ObjectId, ref: 'Character'},
        actionsPolygon: [{type: Schema.Types.ObjectId, ref: 'ActionPolygon'}],
        actionsPoint: [{type: Schema.Types.ObjectId, ref: 'ActionPoint'}]
    }
})

mongoose.model('Sector', SectorSchema);