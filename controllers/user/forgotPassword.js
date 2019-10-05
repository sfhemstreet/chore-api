const {forgotPasswordEmail} = require('../email/email');
const crypto = require("crypto");

// INIT FORGOT PASSWORD 1/3
const initForgotPassword = (req,res,db) => {
    const {email} = req.body;
    if(!email){
        return res.status(400).json('No');
    }
    db.select('email', 'verified')
    .from('login')
    .where('email','=',email)
    .then(data => {
        // check if email is user
        if(!data[0]){
            return res.status(400).json('Account not found, double check email.');
        }
        // check if user is valid
        if(!data[0].verified){
            return res.status(400).json('Account linked to that email has not been comfirmed. We sent you an email to confirm your account when you first created it. Please click the verify link in that email.');
        }
        
        db('login')
        .where('email','=',email)
        .update({
            str: crypto.randomBytes(20).toString('hex')
        })
        .returning('str')
        .then(str => {
            res.status(200).json('Success!');
            return forgotPasswordEmail(email,str[0])
        })
    })
    .catch(err => console.log('error forgotpw finding email', err))
}

// CHECK AUTH FORGOT PASSWORD  2/3
const checkAuthForgotPassword = (req,res,db) => {
    const {str} = req.body;
    if(!str){
        return res.status(401).json('Unauthorized');
    }
    db.select('login_id').from('login').where('str','=',str)
    .then(loginID => {
        if(!loginID[0]){
            return res.status(401).json('Unauthorized');
        }
        req.session.user_id = loginID[0].login_id;
        return res.json({
            success: true,
            id: loginID[0].login_id
        });
    })
    .catch(err => console.log('check auth db error',err))
}

// RESET FORGOT PASSWORD 3/3 - only accept with cookie auth 
const resetForgotPassword = (req,res,db,bcrypt) => {
    const {password, id, str} = req.body;
    
    if(!req.session.user_id || str === ''){
        return res.status(401).json('MUST LOGIN');
    }
    
    db.select('login_id').from('login').where('login_id','=',id).andWhere('str','=',str)
    .then(data => {
        if(!data[0]){
            return res.status(401).json('MUST LOGIN')
        }
        bcrypt.hash(password,15,(err,hashedPW) => {
            if(err){
                console.log('hash error',err);
            }
            db('login').where('login_id','=',id).andWhere('str','=',str)
            .update({
                str: null,
                hash: hashedPW
            })
            .then(() => {
                return res.status(200).json('Success')
            })
            .catch(err => {
                console.log('error at update',err)
                return res.status(401).json('MUST LOGIN')
            })
        })
    })
    .catch(err => console.log('db error',err))
}

module.exports = {
    initForgotPassword,
    resetForgotPassword,
    checkAuthForgotPassword
}