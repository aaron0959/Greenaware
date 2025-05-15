const observation = require('../models/observation');

module.exports = function (app) {
 
    //connect to database using details in the dbconfig file
    const mongoose = require('../config/dbconfig');
    //connecting to the passport extension for login
    const passport = require("passport");
    //connecting to express
    const express = require('express');
    //create an instance of user based on model
    const User = require('../models/user');
    //create an instance of observation based model
    const Observation = require('../models/observation');
    //setting up a router for express to connect to the code with
    const router = express.Router();
    //initializing all the passport functions for when the user needs to login
    passport.use(User.createStrategy());
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());
    const path = require("path");
    const parentDirectory = path.dirname(__dirname);
    //setting up some date and time variables with correspondance to the format js likes
    //these functions will get the current time and date to the exact second for when recording data
    const current = new Date();
    const date = current.toLocaleDateString();
    const time = current.toLocaleTimeString();

    //function to chec that the user logging in has used the correct credentials
    checkAuth = (req, res, next) => {
        // passport adds this to the request object
        if (req.isAuthenticated()) {
        return next();
        }
        res.redirect("/login");
        };
    
    app.use((req, res, next) => {
        res.locals.currentUser = req.user;
        next();
    });
    //initial function that will be called as soon as app.js is online
    app.get("/", (req, res) =>{
        res.render("login");
    })

    //.get function for the register page
    app.get("/register", (req, res) =>{
        console.log(`Authenticated at /register: ${req.isAuthenticated()}`);
        res.render("register");
    });
    //.post function for register page
    app.post("/register", async (req,res) => {
        User.register(new User({ username: req.body.username }),req.body.password,function (err, user) {
            if (err) {
                console.log(err);
                return res.render("register");
            } else {
                passport.authenticate("local")(req, res, function () {
                    console.log(`Authenticated: ${req.isAuthenticated()}`);
                    res.redirect("/login");
                });
            }
        }
    )
    });
    //.get for login page
    app.get("/login", (req, res) => {
        console.log(`Authenticated at /login: ${req.isAuthenticated()}`);
        res.render("login");
    });
    /** .post for login page
    this page will check to see if the user has inputted the correct and matching credentials and then will send the user 
    to the appropriate page whether the authentication goes through and they get sent to the main homepage or they are
    sent back to the login page if a failed attempt is made*/
    app.post("/login", passport.authenticate("local", {
        successRedirect: "/users/clientIndex",
        failureRedirect: "/login",
    })
    );
    /**.get for client index */
    app.get("/users/clientIndex", (req, res) => {
        res.render("../users/clientIndex")
    });
    /**.get for admin index */
    app.get("/users/adminIndex", (req, res) => {
        res.render("../users/adminIndex")
    });
    /**.get for the getusers page  */
    app.get("/users/getusers", async (req, res) => {
        try{
            /**Here we assign a constant for the user to be found as this page requires finding all the current acctive users
             * The constant will wait for the User object to be found then will call to render the page sending the group of objects
             * found into the main getusers method
             */
            const qryRes = await User.find();
            res.render("../users/getusers", {users: qryRes});

        }
        catch(error){
            res.status(500).json({message: error.message});
        }
    })

    
    /**.get method for the adduser page */
    app.get("/users/adduser", (req, res) => {
        res.render("../users/adduser")
    });
    
    //All routes related to http://localhost:3000/users/..
     
    /**.post method for the adduser page */
    app.post('/users/adduser', (req, res) => {

        //save a new user with the name 'Hello World' when route is requested
        //create an instance of User
        const NewUser = new User({ 
            usertitle    : req.body.usertitle,
            userforename : req.body.userforename,
            usersurname  : req.body.usersurname,
            userAddress  : req.body.userAddress,
            executiveAC  : req.body.executiveAC,
            userStatus   : req.body.userStatus,
        });
       
        try {
            /**attempts to save this new user to the database */
            NewUser.save();
            console.log('New User saved in database')
        }
        catch(err) {
            return handleError(err);
        }
        /**as soon as the new user is saved the client is redirected to the getusers page
         * where they can see all the current and the new users
         */
        res.redirect('/users/getusers');
    });

    /**.get method for the getusers page. This is a second method and I do not know
     * when I added this however the code works therefore I am keeping it
     */
    app.get('/users/getusers',  async (req, res) => {
        res.send('See all users in console.log!');
        
        try {
            const user = await User.find({});
            console.log(user);
            
        }
        catch(err) {
            console.log(err);
        }
    });
    /**This is the .get method for the queryuserbyid. 
     * This method sifts through all the user objects stored in the sysusers database and allows the user to select one. 
     * For this I chose a drop down box as it is a clear simple way to do this
     * When the user has chosen the account they want to view then that _id is sent through to the next method
     */
    app.get("/users/queryuserbyid", async (req, res) => {
        try{
            const qryRes = await User.find();
            res.render("../users/queryuserbyid", {users: qryRes});
        }
        catch(error){
            res.status(500).json({message: error.message})
        }
    });
    /**.post method for query user
     * once the user found the account they want to view the object _id is passed into this method.
     * this part of the code then find the object in the database and will display all the relevent information to that object.
     */
    app.post("/users/queryuser", async (req, res) => {
        try{
            const qryRes = await User.findById(req.body._id);
            res.render("../users/queryuser", {user: qryRes});
        }
        catch (error){
            res.status(500).json({message: error.message});
        }

    })

    /**Again this method is a .get for the delete user which it does the same as queryuserbyid. SO the user can find the account they
     * want to delete by selecting the full name in a drop down box
     * After this the user then confirms their selection and that object's _id will be sent over to be deleted
     */
    app.get("/users/deleteuserbyid", async (req, res) => {
        try{
            const qryRes = await User.find();
            res.render("../users/deleteuserbyid", {users: qryRes});
        }
        catch (error){
            res.status(500).json({ message: error.message});
        }
    });
    /**.post method for deleting a user */
    app.post("/users/deleteuser", async (req, res) => {
        try{
            const id = req.body._id;
            console.log(`${id} has been removed from the database`)
            const qryRes = await User.findByIdAndDelete(id)
            res.redirect("/users/getusers");
        }
        catch(error){
            res.status(500).json({message: error.message});
        }
    })
    /**.get for update user
     * The current user will search through accounts to choose to update
     * once this account is found then the object _id is sent through to the .post
     */
    app.get("/users/updateuser", async (req, res) => {
        try{
            const qryRes = await User.find();
            res.render("../users/updateuser", {users: qryRes})
        }
        catch (error){
            res.status(500).json({ message: error.message});
        }
    });
    /**.post for the update user page
     * Once the _id has been retrieved in the .get, the whole object is sent through to the page to then be 
     * changed to the appropriate values as reset by the user
     */
    app.post("/users/updateuser", async (req, res) => {
        try{
            const filter = req.body._id;
            const updateQry = req.body;
            const options = {new: true};
            const qryRes = await User.findByIdAndUpdate(
                filter, updateQry, options
            )
            res.redirect("/users/getusers");
        }
        catch (error){
            res.status(500).json({ message: error.message})
        }
    });

    app.get("/users/updateUserLimited", async (req, res) => {
        try{
            const qryRes = await User.find();
            res.render("../users/updateUserLimited", {users: qryRes})
        }
        catch (error){
            res.status(500).json({ message: error.message});
        }
    });

    app.post("/users/updateUserLimited", async (req, res) => {
        var username = req.body.username;
        var password = req.body.password;
        
        try{
            User.findOne({username: username, password: password});
            const filter = req.body._id;
            const updateQry = req.body;
            const options = {new: true};
            const qryRes = await User.findByIdAndUpdate(
                filter, updateQry, options
            )
            res.redirect("/users/getusers");

        }
        catch{
            console.log(`Update User failed attempt on ${date} at ${time}`);
        }
        });

    /**.get for the addobservation page
     */
    app.get("/observations/addObservation", (req, res) => {
        res.render("../observations/addObservation");
    });
    /**.post for add observation page */
    app.post("/observations/addObservation", (req, res) =>{
        //CREATE NEW OBSERVATION INSTANCE
        const newObservation = new Observation({
            authorName    : req.body.authorName,
            date          : date,
            time          : time,
            timeZone      : req.body.timeZone,
            w3w           : req.body.w3w,
            temp          : req.body.temp,
            humidity      : req.body.humidity,
            windspeed     : req.body.windspeed,
            windDirection : req.body.windDirection,
            precipitation : req.body.precipitation,
            haze          : req.body.haze,
            notes         : req.body.notes
        });

        try{
            newObservation.save();
            console.log(`New observation recorded successfully on ${date} at ${time}`);
        }
        catch (err){
            return handleError(err);
        }

        res.render("/observations/showObservation");
    });
    /**.get for show observation method */
    app.get("/observations/showObservation", async (req, res) => {
        try{
            const qryRes = await Observation.find();
            res.render("../observations/showObservation", {observations : qryRes})
        }
        catch (error){
            res.status(500).json({message : error.message});
        }
    });
    /**.get for query observation */
    app.get("/observations/queryObservationById", async (req, res) => {
        try{
            const qryRes = await Observation.find();
            res.render("../observations/queryObservationById", {observations: qryRes});
        }
        catch (err){
            res.status(500).json({message: err.message});
        }
    });
    /**.post for query observation method */
    app.post("/observations/queryObservation", async (req, res) => {
        try{
            const qryRes = await Observation.findById(req.body._id);
            res.render("../observations/queryObservation", {observation: qryRes});
        }
        catch(err){
            res.status(500).json({message: err.message});
        }
    });


};