const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const knex = require('knex');

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

// ROOT
/*
app.get('/', (req,res) => {
    res.send('Working');
});
*/

// SIGN IN 
app.post('/signin', (req,res) => {signin.handleSignin(req,res,db,bcrypt)});

// REGISTER
app.post('/register', (req,res) => {register.handleRegister(req,res,db,bcrypt)});
/*
// PROFILE
app.get('/profile/:id', (req,res) => { profile.handleProfileGet(req,res,db) });
*/




app.listen(process.env.PORT || 3000, () => {
    console.log(`App running on port ${process.env.PORT}`);
});


// to delete user, delete from login table
