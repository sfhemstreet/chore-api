
const {forgotPasswordEmail} = require('../email/email');


// CHANGE PASSWORD - auth user with oldPassword and update db to newPassword
const changePassword = (req,res,db,bcrypt) => {
    if(req.session.user_id){
        const {oldPassword, newPassword} = req.body;
        // compares db hash pw to sent in pw
        db.select('hash').from('login')
        .where('login_id', '=', req.session.user_id)
        .then(data => {
            bcrypt.compare(oldPassword, data[0].hash)
            .then(pass => {   
                if(pass){
                    bcrypt.hash(newPassword, 15, (error, hashedPW) => {
                        if(error){
                            return res.status(400).json('Hash')
                        }
                        return db('login')
                        .where('login_id','=',req.session.user_id)
                        .update({ hash: hashedPW })
                        .then(() => res.json('Password Changed'))
                        .catch(err => console.log(err))
                    })
                }
                else{
                    return res.json('Unable to verify user')
                }
            }).catch(err => console.log(err))
        }).catch(err => console.log(err))
    }   
    else{
        return res.status(403).json('MUST LOGIN')
    }
}



module.exports = {
    changePassword
}