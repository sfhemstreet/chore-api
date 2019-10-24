const {organizeChoreData} = require('../../util/organizeChoreData.js');

const getChores = async (req,res,db) => {
    
    if(!req.user_id){
        return res.status(401)
    }
    // get all chores from all groups associated with this user  
    return  db.select('users.email')
    .from('users')
    .where('users.user_id','=',req.user_id)
    .then(email => {
        if(!email[0]){
            return res.status(403).json('MUST LOGIN')
        }
        const THIS_USERS_EMAIL = email[0].email;
        db.select(
        // chore NAME ID DESCRIPTION ASSIGN_DATE DUE_DATE COMPLETE_DATE
        'chores.chore_name','chores.chore_id','chores.description','chores.assign_date','chores.due_date','chores.complete_date','chores.type',
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

module.exports = {
    getChores
}