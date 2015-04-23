var mongoose = require('mongoose'),
        Schema = mongoose.Schema;

var ActionPointSchema = new Schema({
    type: String,
    geometry: {type: Schema.Types, ref: 'Point'},
    properties: {type: Schema.Types, ref: 'PointProperties'}
});

mongoose.model('ActionPoint', ActionPointSchema);