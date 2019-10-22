const jwt = require('jsonwebtoken');

const createToken = (data) => {
    return new Promise((resolve, reject) => {
        jwt.sign({ data: data }, process.env.TOKEN_SECRET, { algorithm: 'HS256', expiresIn: '1h' }, (err, token) => {
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