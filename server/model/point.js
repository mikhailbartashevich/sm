var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

// create a schema
var pointSchema = new Schema({
    timestamp: { type: Date, required: true },
    userid: { type: String, required: true },
    'stress-level': { type: Number, required: true },
    'travel-type': String,
    geolocation : {
        latitude : Number,
        longitude : Number
    },
    locations : Schema.Types.Mixed,
    'mobile-event' : String,
    'car-event' : String,
    weather :  Schema.Types.Mixed
});


mongoose.model('Point', pointSchema);