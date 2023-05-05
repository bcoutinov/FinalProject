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
const mongoDBURL = 'mongodb://127.0.0.1/Final';

mongoose.connect(mongoDBURL, {useNewUrlParser: true});
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
    res.end('Access Denied');
  }
}

var Schema = mongoose.Schema;

// Task schema
var TicketSchema = new Schema({
  title: String,
  user: String,
  priority: Number,
  date: String,
  type: String,
  description: String,
  status: String,
  chats: []
});

// User schema
var UserSchema = new Schema({
  username: String,
  password: String,
  priv: String, // u for user, a for admin
  tickets: []
});

var ticket = mongoose.model('model', TicketSchema);
var user = mongoose.model('user', UserSchema);

var admin = new user({
  username: "admin",
  password: "admin",
  priv: 'a'
});

// Adds a user to the db
app.post('/post/newUser/', (req, res) => { 
  let u = req.body.username;
  let p = req.body.password;

  let p1 = user.findOne({username : u}).exec();
  p1.then( (results) => {
    if (results == null) { 
      var newUser = new user({
        username: u,
        password: p,
        priv: 'u'
      });
      let p2 = newUser.save();
      p2.then((doc => {
        res.sendStatus(200);
        console.log("Added User: "+ u + " " +p);
      }))
      p2.catch((err) => {
        res.sendStatus(201);
        console.log('Error')
      });
    }
    else{
      res.sendStatus (201);
    }
  });

});

// Returns a JSON array containing the information for every ticket.
app.get('/home_admin', auth, checkAdmin, (req, res) => {
  res.sendFile('./public_html/admin.html', {root: __dirname });
});

// Retrieves all tickets for admins
app.get('/get/adminTickets', auth, checkAdmin, (req, res) => {
  let p1 = ticket.find({}).exec();
  p1.then( (results) => {
      res.end(JSON.stringify(results));
  });
  p1.catch( (err) => {
    res.end(err);
  });
});

// Returns a Json of tickets for one user
app.get('/home', auth, (req, res) =>{
  res.sendFile('./public_html/home.html', {root: __dirname });
});

// Retrieves a user's tickets
app.get('/get/userTickets/', auth, (req,res) => {
  let u = req.cookies.login.username;
  let p1 = user.findOne({username : u}).exec();
  p1.then( (results) => {
    let id = results.tickets
    let p2 = ticket.find({_id: id}).exec()
    p2.then((results) => {
      res.end(JSON.stringify(results))
    });
    p2.catch((err) => {
      console.log("Couldn't find tickets");
      res.end("Couldn't find tickets")
    });
  });
  p1.catch((err) => {
    res.end(err);
  });
})

// Returns information for one ticket
app.get('/get/ticket/', auth, (req, res) => {
  let id = req.cookies.ticketId.id;
  let p1 = ticket.findById(id).exec()
  p1.then((results) => {
    res.end(JSON.stringify(results));
  });
  p1.catch((err) => {
    res.end(err);
  });
});

// Returns the page for the ticketView page
app.get('/ticketView', auth, (req,res) => {
  res.sendFile('./public_html/ticket.html', {root: __dirname });
});

// Creates a cookie of ticket id used for ticketViewer
app.post('/post/ticketView', auth, (req,res) => {
  let id = req.body.ticketId
  res.cookie("ticketId", {id: id}, {maxAge:120000});
  res.sendStatus(200);
});

// Adds a ticket to the db
app.post('/post/newTicket/', auth, (req, res) => {

  let t = req.body.title;
  let u = req.cookies.login.username;
  let p = req.body.priority;
  let date = req.body.date;
  let s = req.body.status;
  let typ = req.body.type;
  let desc = req.body.desc;

  let newTicket = new ticket({
    title: t,
    user: u,
    priority: p,
    date: date,
    type: typ,
    status: s,
    description: desc
  });

  let p1 = newTicket.save();
  p1.then((doc => {
    let id = doc._id.toString();
    console.log("New ticket: "+ t);
    let p2 = user.findOne({username: u}).exec();
    p2.then((doc =>{
      doc.tickets.push(id);
      let p3 = doc.save();
      p3.then((doc => {
        console.log("New ticket: "+ t + " added to: " + u);
        res.end('Success');
      }));
      p3.catch((err) => {
        console.log("Error saving to user");
        res.end('error');
      });
    }));
    p2.catch((err) => {
      console.log('User not found')
      res.end('error');
    });
  }));
  p1.catch((err) => {
    console.log('Error making ticket')
    res.end('error');
  });
});

// Handles logins
app.post('/post/login', (req, res) => {
  let u = req.body.username;
  let p = req.body.password;

  let p1 = user.findOne({"username": u}).exec();
  p1.then((results) => {
    if (results == null){
      res.sendStatus(202);
      return
    }
    else if (results.password == p){
      if (results.priv == 'a'){
        let sid = addSession(u, 'a');
        res.cookie("login", {username: u, sid: sid, priv: results.priv}, {maxAge:120000});
        res.sendStatus(201);
      }
      else{
        let sid = addSession(u, 'u');
        res.cookie("login", {username: u, sid: sid, priv: results.priv}, {maxAge:120000});
        res.sendStatus(200);
      }
    }
    else{
      res.end("error");
    }
  });
  p1.catch((err) => {
    res.end(err);
  });
});

// Posts a chat message to a ticket
app.post('/post/msg', auth, (req,res) => {
  let u = req.cookies.login.username;
  let id = req.cookies.ticketId.id;
  let msg = req.body.msg;
  let msgItm = [u, msg];
  let p1 = ticket.findById(id).exec()
  p1.then((results) => {
    results.chats.push(msgItm);
    let p2 = results.save();
    p2.then((results) => {
      res.sendStatus(200);
    });
  });
  p1.catch((err) => {
    res.end('Ticket not found');
  });
})

// Updates status of a ticket
app.post('/post/updtMsg', auth, (req,res) => {
  let id = req.body.id;
  let stat = req.body.stat;

  let p1 = ticket.findById(id).exec()
  p1.then((results) => {
    results.status = stat;
    
    let p2 = results.save();
    p2.then((results) => {
      res.end('stat saved');
    });
  });
  p1.catch((err) => {
    res.end('Ticket not found');
  });
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