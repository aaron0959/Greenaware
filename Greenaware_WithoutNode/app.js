const express = require('express')
const app = express()
const port = 3000
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true}));
//set ejs as templating engine
app.set('view engine', 'ejs');
app.set('views', [__dirname + "/views",__dirname + "/views/users"]);

//Setting up a connection to mongoose database
const mongoose = require("./config/dbconfig");
//Setting up session based authorization
const session = require("express-session");
app.use(
    session({
        secret: "randomisedtext",
        resave: false,
        saveUninitialized: false,
    })
);

//Initializing the passport extension for the login details
const passport = require("passport");
app.use(passport.initialize());
app.use(passport.session());      

//setting main route for app.js to call to start the program
require("./routes/userroutes")(app);
//use ejs to render homepage
app.get("/", (req, res) => {
    res.render("login");
});
//confrmation app.js is online at localhost.
app.listen(port, () => {
 console.log(`App listening at http://localhost:${port}`)
})
