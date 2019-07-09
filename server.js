const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const knex = require('knex');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);
const parseurl = require('parseurl');


const register = require('./controllers/register.js');
const signin = require('./controllers/signin.js');
//const profile = require('./controllers/profile.js');

const ONE_HOUR = 2 * 60 * 60 * 1000;

const {
    PORT = 3000,
    NODE_ENV = 'dev',
    SESS_NAME = 'sid',
    SESS_SECRET = 'keepitsecretkeepitsafe',
    SESS_LIFETIME = ONE_HOUR
} = process.env;

const IN_PROD = NODE_ENV === 'prod';

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
const store = new KnexSessionStore({
    knex: db,
    tablename: 'user_sessions'
})


const app = express();

// middleware
app.use(bodyParser.json());
app.use(cors());

app.use(session({
    store: store,
    name: SESS_NAME,
    secret: SESS_SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: {
        path: "/",
        maxAge: SESS_LIFETIME,
        secure: IN_PROD,
        httpOnly: false
    },
    name: "id",
    
}));

// change to where frontend is hosted !
const corsOptions = {
    origin: 'http://localhost:3002',
  }

// SIGN IN 
app.post('/signin', cors(corsOptions), (req,res) => {signin.handleSignin(req,res,db,bcrypt)});

// REGISTER
app.post('/register',cors(corsOptions), (req,res) => {register.handleRegister(req,res,db,bcrypt)});
/*
// PROFILE
app.get('/profile/:id', (req,res) => { profile.handleProfileGet(req,res,db) });
*/




app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
});


// to delete user, delete from login table
