
const {forgotPasswordEmail} = require('../email/email');


// CHANGE PASSWORD - auth user with oldPassword and update db to newPassword
const changePassword = (req,res,db,bcrypt) => {
    if(req.user_id){
        const {oldPassword, newPassword} = req.body;
        // compares db hash pw to sent in pw
        db.select('hash').from('login')
        .where('login_id', '=', req.user_id)
        .then(data => {
            bcrypt.compare(oldPassword, data[0].hash)
            .then(pass => {   
                if(pass){
                    bcrypt.hash(newPassword, 15, (error, hashedPW) => {
                        if(error){
                            return res.status(500).json('Error on our end')
                        }
                        return db('login')
                        .where('login_id','=',req.user_id)
                        .update({ hash: hashedPW })
                        .then(() => res.status(200).json('Password Changed'))
                        .catch(err => console.log(err))
                    })
                }
                else{
                    return res.status(400).json('Unable to verify user')
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