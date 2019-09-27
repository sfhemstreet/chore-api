const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const knex = require('knex');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);
// Modules
const register = require('./controllers/register.js');
const signin = require('./controllers/signin.js');
const profile = require('./controllers/profile.js');
const groups = require('./controllers/groups.js');

// Constants
const TWO_HOURS = 2 * 60 * 60 * 1000;


// Process.env
const {
    PORT = 4000,
    NODE_ENV = 'dev',
    SESS_SECRET = 'keepitsecretkeepitsafe',
    SESS_LIFETIME = TWO_HOURS
} = process.env;

const IN_PROD = NODE_ENV === 'prod';

const app = express();

// setup database
const db = knex({
    client: 'pg',
    connection: {
        host : '127.0.0.1',
        user : '',
        password : '',
        database : 'postgres'
    }
});
// store for session 
const pgstore = new KnexSessionStore({
    knex: db,
    tablename: 'user_sessions'
});
// Set up express-session
app.use(session({
    store: pgstore,
    name: 'sid',
    secret: SESS_SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: {
        path: "/",
        maxAge: SESS_LIFETIME,
        secure: IN_PROD,
        sameSite: false,
        httpOnly: true
    }
}));

// body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// CORS middleware ->>> change to where frontend is hosted !
const corsOptions = {
    credentials: true,
    origin: 'http://localhost:3000'
}
app.use(cors(corsOptions));

// ROUTES
// SIGN IN 
app.post('/signin',  (req,res) => {signin.handleSignin(req,res,db,bcrypt)});

// REGISTER
app.post('/register', (req,res) => {register.handleRegister(req,res,db,bcrypt)});

// PROFILE - user specific 
app.get('/getchores',  (req,res) => {profile.getChores(req,res,db)});
app.patch('/submitchore', (req,res) => {profile.submitChore(req,res,db)});
app.delete('/deleteaccount', (req,res) => {profile.deleteAccount(req,res,db,bcrypt)});
app.patch('/changepassword', (req,res) => {profile.changePassword(req,res,db,bcrypt)});

// GROUP - group specific 
app.post('/creategroup', async(req,res) => {groups.createGroup(req,res,db)});
app.post('/addchores', (req,res) => {groups.addChores(req,res,db)});
app.delete('/deletegroup', (req,res) => {groups.deleteGroup(req,res,db)});
app.patch('/editgroup', (req,res) => {groups.editGroup(req,res,db)});

// Listen 
app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
});




/* NOTES */
/*
POSTGRES
- to delete user, delete from login table
- move sql queries to seperate files
SESSIONS
- change name of session id
- test multiple users at once
- create route to authentic user actions
MESSAGING
- integrate socket.io
*/


module.exports = {
    app
}