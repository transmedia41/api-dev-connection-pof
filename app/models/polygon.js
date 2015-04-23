var mongoose = require('mongoose'),
        Schema = mongoose.Schema;

var PolygonSchema = new Schema({
    type: String,
    coordinates: [{type:Number}]
});

mongoose.model('Polygon', PolygonSchema);