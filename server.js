const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const knex = require('knex');
const jwt = require('jsonwebtoken')

const register = require('./controllers/register.js');
const signin = require('./controllers/signin.js');
//const profile = require('./controllers/profile.js');

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



const app = express();

// middleware
app.use(bodyParser.json());
app.use(cors());

// change to where frontend is hosted !
const corsOptions = {
    origin: 'http://localhost:3002',
  }

// SIGN IN 
app.post('/signin', cors(corsOptions), (req,res) => {signin.handleSignin(req,res,db,bcrypt,jwt)});

// REGISTER
app.post('/register',cors(corsOptions), (req,res) => {register.handleRegister(req,res,db,bcrypt)});
/*
// PROFILE
app.get('/profile/:id', (req,res) => { profile.handleProfileGet(req,res,db) });
*/




app.listen(process.env.PORT || 3000, () => {
    console.log(`App running on port ${process.env.PORT}`);
});


// to delete user, delete from login table
