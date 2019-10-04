const crypto = require("crypto");
const {registerVerificationEmail} = require('../email/email');
const template = require('../../util/htmlTemplates');

// Register new user - hash pw, insert into DB at login and users tables 
const register = (req,res,db,bcrypt) => {
    const {email, password, username} = req.body;
    // do more checks for bad input here!!!
    if(!email || !password || !username){
        return res.status(400).json('Invalid Register Info')
    }
    // Hash with salt set to 15
    bcrypt.hash(password, 15, (error, hashedPW) => {
        if(error){
            return res.status(400).json('Hash')
        }
        // transaction insurances both tables will be inserted into or neither will
        db.transaction(trx => {
            trx.insert({
                email: email,
                hash: hashedPW,
                str: crypto.randomBytes(20).toString('hex')
            })
            .into('login')
            .returning(['login_id', 'str'])
            .then(data => {
                const loginID = data[0].login_id;
                const str = data[0].str;
                return trx('users')
                    .returning('*')
                    .insert({
                        user_id: loginID,
                        email: email,
                        user_name: username,
                        joined: new Date() 
                    })
                    .then(user => {
                        // respond with users table data
                        res.json('Success!');
                        registerVerificationEmail(user[0],str);
                    }) 
                    .catch(error => res.status(400).json('REGISTER ERROR'))
            })
            .then(trx.commit)
            .catch(trx.rollback)
        })
        .catch(error => {
            console.log('duplicate email',error)
            res.status(400).json('Duplicate Email')
        })       
    })
}

// VERIFY USER REGISTERATION
const verification = (req,res,db) => {
    const string = req.params.string;

    db.select('*').from('login').where('str','=',string)
    .then(user => {
        if(!user[0] || user[0].verified){
            res.write(template.notValid());
            return res.end();
        }
        db('login')
        .where('login_id','=',user[0].login_id)
        .update({
            str: null,
            verified: true
        })
        .then(() => {
            res.write(template.verifiedUser());
            return res.end();
        })
        .catch(err => console.log('error in verify db', err))
    })
    .catch(err => console.log('verification error', err))
}

module.exports = {
    register,
    verification
}