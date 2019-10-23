const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const knex = require('knex');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);
// env variables
require('dotenv').config({path: __dirname + '/.env'})

// Controllers
const user = require('./controllers/user/user.js');
const group = require('./controllers/group/group.js');



// Constants
const TWO_HOURS = 2 * 60 * 60 * 1000;

// Process.env
/*
const {
    PORT = 4000,
    NODE_ENV = 'dev',
    SESS_SECRET = 'keepitsecretkeepitsafe',
    SESS_LIFETIME = TWO_HOURS
} = process.env;
*/

//const IN_PROD = NODE_ENV === 'prod';
const IN_PROD = true;
const SESS_LIFETIME = TWO_HOURS;

const app = express();

// setup database
const db = knex({
    client: 'pg',
    connection: process.env.DATABASE_CONNECTION_STRING ? 
        process.env.DATABASE_CONNECTION_STRING 
        :
        {
            host : process.env.DB_HOST || '127.0.0.1',
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
const sess = {
    store: pgstore,
    name: 'sid',
    secret: process.env.SESS_SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: {
        path: "/",
        maxAge: SESS_LIFETIME,
        secure: app.get('env') === 'production' ? true : false,
        sameSite: 'none',
        httpOnly: true
    }
}
if(app.get('env') === 'production'){
    app.set('trust proxy', 1);
}
app.use(session(sess));

// body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// CORS allowed origins
const allowedOrigins = [process.env.FRONTEND_URL,'http://localhost:3000',"https://chore-app-frontend.herokuapp.com", "http://chore-app-frontend.herokuapp.com"];
// CORS middleware options
const corsOptions = {
    origin: (origin, callback) => {
        if(!origin)
            return callback(null, true);
        if(allowedOrigins.indexOf(origin) === -1)
            return callback(Error("CORS, origin invalid"), false);

        return callback(null, true);
    },
    credentials: true,
}
app.use(cors(corsOptions));

app.options('*', cors(corsOptions))
// ROUTES //
app.get('/', (req,res) => {
    return res.json('Hi');
});
/* --- USER --- */
// sign in 
app.post('/signin',  (req,res) => {user.signin(req,res,db,bcrypt)});

// register 
app.post('/register', (req,res) => {user.register(req,res,db,bcrypt)});
app.get('/verify/:string', (req,res) => {user.registerVerification(req,res,db)});

// get chores
app.get('/getchores',  (req,res) => {user.getChores(req,res,db)});

// submit chore
app.patch('/submitchore', (req,res) => {user.submitChore(req,res,db)});

// delete account
app.delete('/deleteaccount', (req,res) => {user.deleteAccount(req,res,db,bcrypt)});

// change password
app.patch('/changepassword', (req,res) => {user.changePassword(req,res,db,bcrypt)});

// forgot password
app.post('/forgotpassword', (req,res) => {user.initForgotPassword(req,res,db)});
app.post('/checkauthforgotpassword', (req,res) => {user.checkAuthForgotPassword(req,res,db)})
app.post('/resetforgotpassword', (req,res) => {user.resetForgotPassword(req,res,db,bcrypt)});

/* --- GROUP --- */
// create new group
app.post('/creategroup', (req,res) => {group.createGroup(req,res,db)});

// add chores to group
app.post('/addchores', (req,res) => {group.addChores(req,res,db)});

// delete group
app.delete('/deletegroup', (req,res) => {group.deleteGroup(req,res,db)});

// edit group - add/remove members / change member permissions
app.patch('/editgroup', (req,res) => {group.editGroup(req,res,db)});



/* --- Listen --- */
app.listen(process.env.PORT, () => {
    console.log(`App running on port ${process.env.PORT}`);
});

module.exports = {
    app
}