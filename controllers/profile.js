const {organizeChoreData} = require('../util/organizeChoreData.js');

const getChores = (req,res,db) => {
    // see if user has session
    if(req.session.user_id){
        // get all chores from groups associated with this user  
        return  db.select(
            'chores.chore_name','chores.chore_id','chores.description','chores.assign_date','chores.due_date','chores.complete_date',
            'users.user_name AS assign_name', 'users.email AS assign_email','users.user_id','users.score',
            'groups.group_name','groups.group_id','groups.created_by','groups.created_by_email')
            .from('users')
            .join('users_in_groups','users_in_groups.user_email','=','assign_email')
            .join('groups', function(){
                this.on('users_in_groups.group_id','=','groups.group_id')
                .onIn('groups.group_id',
                    db.select('users_in_groups.group_id')
                    .from('users_in_groups')
                    .where('users_in_groups.user_id','=',req.session.user_id))
            })
            .leftJoin('chores', function() {
                this.on('assign_email','=','chores.assign_emal').andOn('groups.group_id','=','chores.group_id')
            })
            .where('assign_email', 'IN', 
                db.select('users_in_groups.user_email')
                .from('users_in_groups')
                .where('users_in_groups.group_id','IN',
                    db.select('users_in_groups.group_id')
                    .from('users_in_groups')
                    .where('users_in_groups.user_id','=',req.session.user_id)
                )
            )
            .then(data => {
                const organizedData = organizeChoreData(data, req.session.user_id);
                res.json({
                    chores: organizedData.userChores,
                    groups: organizedData.groups,
                    createdGroups: organizedData.createdGroups
                })  
            })
            .catch(error => {
                console.log(error)
                res.status(400).json('session problem')
            });   
    }
    else{
        res.status(403).json('MUST LOGIN')
    }
}

const submitChore = (req,res,db) => {
    if(req.session.user_id){
        db('chores')
            .where('chore_id', '=', req.body.choreID)
            .update({complete_date: 'now()'})
            .then(() => {
                res.status(200).json('Chore Submitted');
            })
            .catch(err => {
                console.log(err);
                res.status(400).json('error err');
            })
    }   
    else{
        res.status(403).json('MUST LOGIN')
    }
}

module.exports = {
    getChores: getChores,
    submitChore: submitChore
}