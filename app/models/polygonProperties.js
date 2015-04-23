var mongoose = require('mongoose'),
        Schema = mongoose.Schema;

var PolygonPropertiesSchema = new Schema({
    nbActions: {type: Number},
    influence: {type: Number},
    nomsquart: String,
    character: {type: Schema.Types.ObjectId, ref: 'Character'},
    actionsPolygon: [{type: Schema.Types.ObjectId, ref: 'ActionPolygon'}],
    actionsPoint: [{type: Schema.Types.ObjectId, ref: 'ActionPoint'}]
});

mongoose.model('PolygonProperties', PolygonPropertiesSchema);