const {deleteAccountEmail} = require('../email/email');

// DELETE ACCOUNT - auth user with given password then delete account
const deleteAccount = (req,res,db,bcrypt) => {
    if(req.session.user_id){
        const {password} = req.body;
        // compares db hash pw to sent in pw
        db.select('hash').from('login')
        .where('login_id', '=', req.session.user_id)
        .then(data => {
            bcrypt.compare(password, data[0].hash)
            .then(pass => {   
                if(pass){
                    return db.select('email','user_name')
                    .from('users')
                    .where('user_id','=',req.session.user_id)
                    .then(data => {
                        db('users_in_groups')
                        .where('user_email','=',data[0].email)
                        .del()
                        .then(() => {
                            db('chores')
                            .where('assign_email','=',data[0].email)
                            .del()
                            .then(() => {
                                db('login')
                                .where('login_id','=',req.session.user_id)
                                .del()
                                .then(() => {
                                    res.status(200).json('Account Deleted');
                                    deleteAccountEmail(data[0].email, data[0].user_name)
                                })
                                .catch(err => console.log(err))    
                            })
                            .catch(err => console.log(err)) 
                        })  
                        .catch(err => console.log(err))
                    })
                    .catch(err => console.log(err))
                }
                else{
                    return res.status(401).json('Unable to verify user')
                }
            }).catch(err => console.log(err))
        }).catch(err => console.log(err))
    }   
    else{
        return res.status(403).json('MUST LOGIN')
    }
}



module.exports = {
    deleteAccount
}