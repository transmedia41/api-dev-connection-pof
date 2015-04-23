var mongoose = require('mongoose'),
        Schema = mongoose.Schema;

var SectorSchema = new Schema({
    type: String,
    geometry: {type: Schema.Types, ref: 'Polygon'},
    properties: {type: Schema.Types, ref: 'PolygonProperties'}
});

mongoose.model('Sector', SectorSchema);