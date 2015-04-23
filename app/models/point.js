var mongoose = require('mongoose'),
        Schema = mongoose.Schema;

var PointSchema = new Schema({
    type: String,
    coordinates: [{type:Number}]
});

mongoose.model('Point', PointSchema);