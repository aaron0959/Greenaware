const mongoose = require('mongoose'), passportLocalMongoose = require("passport-local-mongoose");
//define a schema for user
const UserSchema = new mongoose.Schema({
    username : String,
    password : String,
    usertitle : String,
    userforename : String,
    usersurname : String,
    userAddress : String,
    executiveAC : String,
    userStatus : String
   });
   
UserSchema.plugin(passportLocalMongoose);

//instantiate an instance of the user model
const User = mongoose.model('sysusers', UserSchema);
//Export function to create User model class
module.exports = mongoose.model('sysusers', UserSchema);