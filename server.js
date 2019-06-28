const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const knex = require('knex');

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
app.get('/', (req,res) => {
    res.send('Working');
});

app.listen(process.env.PORT || 3000, () => {
    console.log(`App running on port ${process.env.PORT}`);
});



