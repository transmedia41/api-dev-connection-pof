var mongoose = require('mongoose'),
        Schema = mongoose.Schema;

var DocumentSchema = new Schema({
    title: String,
    thumbnail: String,
    versionUrl: String,
    src: String,
    type: String,
    templateHtml: String,
    xp: Number
});

mongoose.model('Document', DocumentSchema);