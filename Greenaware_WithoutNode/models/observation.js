const mongoose = require('mongoose');
/**setting up date variables */
const current = new Date();
const date = current.toLocaleDateString();
const time = current.toLocaleTimeString();
//**set up new schema layout for objects */
const observationSchema = new mongoose.Schema({
    authorName : String,
    date : String,
    time : String,
    timeZone : String,
    w3w : String,
    temp :Number,
    humidity : Number,
    windspeed : Number,
    windDirection : String,
    precipitation : Number,
    haze : Number,
    notes : String
});
/**setting up observation database in mongoDB */
const Observation = mongoose.model('observations', observationSchema);
module.exports = mongoose.model('observations', observationSchema);