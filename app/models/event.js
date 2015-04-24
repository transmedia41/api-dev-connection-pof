var mongoose = require('mongoose'),
        Schema = mongoose.Schema;

var EventSchema = new Schema({
    order: {type:Number},
    date: {type:Date},
    description: String,
    xp: {type:Number},
    documents: [{type:Schema.Types.ObjectId, ref:'Document'}]
});

mongoose.model('Event', EventSchema);