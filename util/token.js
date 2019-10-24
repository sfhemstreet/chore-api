const jwt = require('jsonwebtoken');

const CREATE_OPTIONS = { 
    algorithm: 'HS256', 
    expiresIn: '2d',
    issuer: 'me-duh-ididit'
}

const VERIFY_OPTIONS = {
    algorithm: 'HS256', 
    maxAge: '2d',
    
}

const createToken = (data) => {
    return new Promise((resolve, reject) => {
        jwt.sign({'id': data}, process.env.TOKEN_SECRET, {algorithm: 'HS256', expiresIn: '2d'}, (err, token) => {
            if(err){
                console.log(err)
                reject(null);
            }
            else{
                resolve(token);
            }
        });    
    })
    
}

// FIX THIS
const checkToken = (req, res, next) => {
    return new Promise((resolve, reject) => {
        const authHeader = req.headers.authorization;
        if(authHeader){
            const token = req.headers.authorization.split(' ')[1]; // bearer <token>
            
            jwt.verify(token, process.env.TOKEN_SECRET, {algorithm: 'HS256', expiresIn: '2d'}, (err, decoded) => {
                if(err){
                    reject(res.status(401))
                }
                else{
                    req.user_id = decoded.id
                    resolve(next())    
                } 
            })
            .catch(err => {
                console.log('err in jwt verification', err)
                reject(res.status(500))
            })
        }    
    });
}

module.exports = {
    createToken: createToken,
    checkToken: checkToken
}