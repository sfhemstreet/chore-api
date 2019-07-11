// CHANGE THIS TO process.env.secretKey when moving to production
const key = require('../key');

// HANDLE USER SIGN IN
const handleSignin = (req,res,db,bcrypt) => {
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
                    return db.select('email', 'score', 'user_name', 'user_id').from('users')
                        .where('users.email','=',email)
                        .then(userInfo => {
                            const {email, score, user_name, user_id} = userInfo[0];
                            // data we send to user
                            const user = {user_name, email, score};
                            // set session user_id
                            req.session.user_id = user_id;
                            // get all group/chore info that user is apart of
                            db.select('choregroup.group_id')
                            .from('choregroup')
                            .join('chore', 'choregroup.group_id','=','chore.group_id')
                            .join('users','users.user_id','=','chore.assign_id')
                            .where('users.user_id', '=', req.session.user_id)
                            .returning('choregroup.group_id')
                            .then(groupID => {
                                db.select('users.user_name AS assign_name', 
                                    'users.email AS assign_email',
                                    'chore.chore_name',
                                    'chore.assign_date', 
                                    'chore.due_date', 
                                    'chore.complete_date', 
                                    'choregroup.group_name').from('chore')
                                    .join('choregroup','choregroup.group_id','=','chore.group_id')
                                    .join('users','chore.assign_id','=','users.user_id')
                                    .where('choregroup.group_id','=', groupID[0].group_id)
                                    .then(groupData => {
                                        res.json({
                                            groups: groupData,
                                            userData: user
                                        })  
                                    })
                                    .catch(error => {
                                        //console.log(error)
                                        res.status(400).json('group db problem')
                                    });
                            })
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
            res.status(400).json('Wrong Credentials')
        }
    );
}

module.exports = {
    handleSignin: handleSignin
}
