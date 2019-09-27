const jwt = require('jsonwebtoken');
// CHANGE TO PROCESS.ENV
const secret = 'temp_lol_secret';

const createToken = () => {
    jwt.sign({ data: 'secret token yay' }, secret, { algorithm: 'RS256' }, (err, token) => {
        if(err){
            console.log('token error',err);
            return null;
        }
        else{
            console.log('token made!',token);  
            return token;
        }
    });
}

module.exports = {
    createToken: createToken
}