const {forgotPasswordEmail} = require('../email/email');
const crypto = require("crypto");

// INIT FORGOT PASSWORD 1/3
const initForgotPassword = (req,res,db) => {
    const {email} = req.body;
    if(!email){
        return res.json('No');
    }
    db.select('email')
    .from('login')
    .where('email','=',email)
    .then(data => {
        if(!data){
            return res.json('Email not found');
        }
        db('login')
        .where('email','=',email)
        .update({
            str: crypto.randomBytes(20).toString('hex')
        })
        .returning('str')
        .then(str => {
            res.json('Success!');
            return forgotPasswordEmail(email,str[0])
        })
    })
    .catch(err => console.log('error forgotpw finding email', err))
}

// CHECK AUTH FORGOT PASSWORD  2/3
const checkAuthForgotPassword = (req,res,db) => {
    const {str} = req.body;
    if(!str){
        return res.json('Unauthorized');
    }
    db.select('login_id').from('login').where('str','=',str)
    .then(loginID => {
        if(!loginID[0]){
            return res.json('Unauthorized');
        }
        req.session.user_id = loginID[0].login_id;
        console.log('legit', loginID[0].login_id, str)
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
        return res.json('MUST LOGIN');
    }

    db.select('login_id').from('login').where('login_id','=',id).andWhere('str','=',str)
    .then(data => {
        if(!data[0]){
            console.log('no data there')
            return res.json('MUST LOGIN')
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
                return res.json('Success')
            })
            .catch(err => {
                console.log('error at update',err)
                return res.json('MUST LOGIN')
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