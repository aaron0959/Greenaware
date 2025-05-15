const mongoose = require('mongoose');
const mongoDB = 'mongodb+srv://SWE5203:SWE5203@swe5203.q8p4dfj.mongodb.net/?retryWrites=true&w=majority&appName=SWE5203';
mongoose.connect(mongoDB);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
console.log ("Connected successfully to MongoDB!")
});
module.exports = mongoose;