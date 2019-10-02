const jwt = require('jsonwebtoken');
// CHANGE TO PROCESS.ENV
const secret = 'temp_lol_secrettemp_lol_secrettemp_lol_secrettemp_lol_secrettemp_lol_secrettemp_lol_secret';

const createToken = (data) => {
    return new Promise((resolve, reject) => {
        jwt.sign({ data: data }, secret, { algorithm: 'HS256', expiresIn: '1h' }, (err, token) => {
            if(err){
                reject(null);
            }
            else{
                resolve(token);
            }
        });    
    })
    
}

module.exports = {
    createToken: createToken
}