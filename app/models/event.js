var mongoose = require('mongoose'),
        Schema = mongoose.Schema;

var EventSchema = new Schema({
    order: Number,
    date: String,
    description: String,
    xp: Number,
    documents: [{type:Schema.Types.ObjectId, ref:'Document'}]
});

mongoose.model('Event', EventSchema);