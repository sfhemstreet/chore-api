// CHANGE THIS TO process.env.secretKey when moving to production
const key = require('../key');

// HANDLE USER SIGN IN
const handleSignin = (req,res,db, bcrypt) => {
    const {email, password} = req.body;
    // DO MORE CHECKS HERE
    if(!email || !password){
        return res.status(400).json('Wrong Credentials')
    }
    // compares db hash pw to sent in pw
    db.select('hash').from('login')
        .where('email', '=', email)
        .then(data => {
            bcrypt.compare(password, data[0].hash)
            .then(pass => {   
                if(pass){
                    // pw matched, get user info
                    return db.select('*').from('users as u')
                        .where('u.email','=',email)
                        .then(user => {
                            //give user session id 
                            req.session.sid = user[0].user_id
                            res.json({
                                userData: user[0]
                            });  
                        })
                        .catch(error => res.status(400).json('Unable to get user'))
                }
                else{
                    res.status(400).json('Wrong Credentials')
                }
            })
            .catch(error => res.status(400).json('Wrong Credentials'))
               
        })
        .catch(error => {
            console.log(error)
            res.status(400).json('Wrong Credentials')}
        );
}

module.exports = {
    handleSignin: handleSignin
}
