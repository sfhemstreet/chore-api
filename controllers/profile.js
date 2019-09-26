const {organizeChoreData} = require('../util/organizeChoreData.js');

const getChores = (req,res,db) => {
    // see if user has session
    if(req.session.user_id){
        // get all chores from all groups associated with this user  
        return  db.select('users.email')
            .from('users')
            .where('users.user_id','=',req.session.user_id)
            .then(email => {
                if(!email[0]){
                    return res.status(403).json('MUST LOGIN')
                }
                const THIS_USERS_EMAIL = email[0].email;
                db.select(
                // chore NAME ID DESCRIPTION ASSIGN_DATE DUE_DATE COMPLETE_DATE
                'chores.chore_name','chores.chore_id','chores.description','chores.assign_date','chores.due_date','chores.complete_date',
                // user NAME EMAIL SCORE
                'users.user_name AS assign_name', 'users.email AS assign_email','users.score',
                // group NAME ID CREATED_BY_ID CREATED_BY_EMAIL
                'groups.group_name','groups.group_id','groups.created_by','groups.created_by_email',
                'users_in_groups.auth')
                .from('users')
                .join('users_in_groups','users_in_groups.user_email','=','users.email')
                .join('groups', function(){
                    this.on('users_in_groups.group_id','=','groups.group_id')
                    .onIn('groups.group_id',
                        db.select('users_in_groups.group_id')
                        .from('users_in_groups')
                        .where('users_in_groups.user_email','=',THIS_USERS_EMAIL)
                    )
                })
                .leftJoin('chores', function() {
                    this.on('users.email','=','chores.assign_email').andOn('groups.group_id','=','chores.group_id')
                })
                .where('users.email', 'IN', 
                    db.select('users_in_groups.user_email')
                    .from('users_in_groups')
                    .where('users_in_groups.group_id','IN',
                        db.select('users_in_groups.group_id')
                        .from('users_in_groups')
                        .where('users_in_groups.user_email','=',THIS_USERS_EMAIL)
                    )
                )
                .then(data => {
                    const organizedData = organizeChoreData(data, THIS_USERS_EMAIL);
                    res.json({
                        // this users chores
                        chores: organizedData.userChores,
                        // data from all groups user is in 
                        groups: organizedData.groups,
                        // if user created group they get special permissions
                        createdGroups: organizedData.createdGroups,
                        // stores if user can add chores to group
                        auth: organizedData.authorization
                    })  
                })
                .catch(error => {
                    console.log(error)
                    res.status(400).json('get chores error')
                });   
            })
    }
    else{
        res.status(403).json('MUST LOGIN')
    }
}

// user submits chore, update complete_date in DB, increase user score 
const submitChore = (req,res,db) => {
    if(req.session.user_id){
        db('chores')
        .where('chore_id', '=', req.body.choreID)
        .update({complete_date: 'now()'})
        .then(() => {
            db('users')
            .where('user_id','=',req.session.user_id)
            .increment('score',1)
            .then(() => {
                res.status(200).json('Chore Submitted');
            })
            .catch(err => {
                console.log('error at update score',err);
                res.status(400).json('error');
            })
        })
        .catch(err => {
            console.log('error at update complete date',err);
            res.status(400).json('error');
        })
    }   
    else{
        res.status(403).json('MUST LOGIN')
    }
}

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
                    return db.select('email')
                    .from('login')
                    .where('login_id','=',req.session.user_id)
                    .then(email => {
                        db('users_in_groups')
                        .where('user_email','=',email[0].email)
                        .del()
                        .then(() => {
                            db('chores')
                            .where('assign_email','=',email[0].email)
                            .del()
                            .then(() => {
                                db('login')
                                .where('login_id','=',req.session.user_id)
                                .del()
                                .then(() => res.json('Account Deleted'))
                                .catch(err => console.log(err))    
                            })
                            .catch(err => console.log(err)) 
                        })  
                        .catch(err => console.log(err))
                    })
                    .catch(err => console.log(err))
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
    getChores,
    submitChore,
    deleteAccount,
    changePassword
}