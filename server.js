/*
Carlton Louie
Mar. 21 2023
This is a JS file server side functionality
*/

const express = require('express');
const app = express();
const port = 80;
app.use(express.static('./public_html')); // Loads HTML for UI
const { default: mongoose } = require('mongoose');
const parser = require('body-parser');
const mongoDBURL = 'INSERT - MONGODB URL';

mongoose.connect(mongoDBURL, { useNewUrlParser: true});
mongoose.connection.on('error', () => {
  console.log('There was a problem connection to mongoDB');
});

app.use(parser.json());
app.use(parser.urlencoded({ extended: true }));

var cookieParser = require('cookie-parser');
app.use(cookieParser());

var sessions = {};

// Adds a session id for each user
function addSession(user, adminPriv){
	let sessionId = Math.floor(Math.random()*100000);
	let sessionStart = Date.now();
	sessions[user] =  {'sid' : sessionId, 'start' : sessionStart, 'priv' : adminPriv};
  return sessionId;
}

// Checks if it is a valid session id
function doesUserHaveSession(user, sessionId){
  let entry = sessions[user];
  if (entry!=undefined) {
    return entry.sid == sessionId;
  }
}

// Checks if user is an admin
function checkAdmin(req, res, next){
  if (sessions[req.cookies.login.username].priv == 'a'){
    next()
  }
  else{
    return res.end('Access Denied');
  }
}

var Schema = mongoose.Schema;

// Task schema
var TicketSchema = new Schema({
  title: String,
  user: String,
  priority: Number,
  date: String,
  assignedTo: [],
  type: String,
  description: String,
  chats: []
});

// User schema
var UserSchema = new Schema({
  username: String,
  password: String,
  priv: String, // u for user, a for admin
  tickets: [],
  assigned: [] 
});

// Chat schema
var ChatSchema = new Schema({
  user: String,
  date: String,
  ticket: String,
  message: String
});

var ticket = mongoose.model('model', TaskSchema);
var user = mongoose.model('user', UserSchema);
var chat = mongoose.model('chat', ChatSchema);

// Adds a user to the db
app.post('/post/newUser/', (req, res) => { 
  let u = req.body.username;
  let p = req.body.password;

  var newUser = new user({
    username: u,
    password: p,
    type: client
  });
  let p1 = newUser.save();
  p1.then((doc => {
    res.end('User Created!');
    console.log("Added User: "+ u + " " +p);
  }))
  p1.catch((err) => {
    console.log('Error')
  });
});

// Returns a JSON array containing the information for every task.
app.get('/get/tickets/', auth, checkAdmin, (req, res) => { 
  let p1 = task.find({}).exec();
  p1.then( (results) => {
      res.end(JSON.stringify(results));
  });
});

// Returns a Json of tickets for one user
app.get('/get/tickets/:username', auth, (req, res) =>{ 
  let u = req.cookies.login.username;
  let p1 = user.findOne({username : u}).exec();
  p1.then( (results) => {
    let id = results.tickets
    console.log(id);
    let p2 = ticket.find({_id: id}).exec()
    p2.then((results) => {
      console.log(JSON.stringify(results));
      res.end(JSON.stringify(results));
    });
    p2.catch((err) => {
      console.log("Couldn't find tickets");
      res.end("Couldn't find tickets")
    });
  });
  p1.catch((err) => {
    res.end(err);
  });
});



// Adds an item to the db
app.post('/post/tickets/', auth, (req, res) => {

  let t = req.body.title;
  let u = req.body.username;  
  let p = req.body.priority;
  let date = req.body.date;
  let usersAssigned = req.body.assignedTo;
  let typ = req.body.type;
  let desc = req.body.desc;

  let newTicket = new ticket({
    title: t,
    user: u,
    priority: p,
    date: date,
    assignedTo: usersAssigned,
    type: typ,
    description: desc
  });

  let p1 = newTicket.save();
  p1.then((doc => {
    let id = doc._id.toString();
    console.log("New ticket: "+ t);
    let p2 = user.findOne({username: u}).exec();
    p2.then((doc =>{
      doc.listings.push(id);
      let p3 = doc.save();
      p3.then((doc => {
        console.log("New ticket: "+ t + " added to: " + u);
        res.redirect('/home');
      }));
      p3.catch((err) => {
        console.log("Error saving to user");
        res.redirect('/home');
      });
    }));
    p2.catch((err) => {
      console.log('User not found')
      res.redirect('/home');
    });
  }));
  p1.catch((err) => {
    console.log('Error making ticket')
    res.redirect('/home');
  });
});

// Handles logins
app.post('/post/login', (req, res,) => {
  let u = req.body.password;
  let p = req.body.password;

  let p1 = user.findOne({"username": u}).exec();
  p1.then((results) => {
    if (results == null){
      res.end("error logging in");
      console.log("no user found");
      return
    }
    else if (results.password == p){
      if (results.priv == 'a'){
        let sid = addSession(u, 'a');
      }
      else{
        let sid = addSession(u, 'u');
      }
      res.cookie("login", {username: u, sid: sid}, {maxAge:120000});
      res.redirect('/home');
    }
    else{
      console.log("bruh 2");
      res.end(error);
    }
  });
  p1.catch((error) => {
    console.log(error);
  });
});

// Redirects back to the home page
app.get('/home', auth, (req,res) =>{
  res.redirect('/home.html');
});

app.listen(port, () => {
    console.log(`Server running at ${port}`);
});

//Checks if users have a valid session token
function auth(req, res, next){
  try{
    if(req.cookies != undefined || req.cookies != undefined){
      if(doesUserHaveSession(req.cookies.login.username, req.cookies.login.sid)){
        next();
      } 
    }
    else{
      return res.redirect(302, '/');
    }
  }
  catch{
    return res.redirect(302, '/');
  }
}