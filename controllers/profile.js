const {organizeChoreData} = require('../util/organizeChoreData.js');

const getChores = (req,res,db) => {
    // see if user has session
    if(req.session.user_id){
        // get all chores from groups associated with this user  
        return  db.select(
            'chore.chore_name',
            'chore.chore_id',
            'chore.description',
            'chore.assign_date',
            'chore.due_date',
            'chore.complete_date',
            'users.user_name AS assign_name', 
            'users.email AS assign_email',
            'users.user_id',
            'users.score',
            'choregroup.group_name',
            'choregroup.group_id',
            'choregroup.created_by',
            'choregroup.created_by_email')
            .from('users')
            .join('users_in_groups','users_in_groups.user_id','=','users.user_id')
            .join('choregroup', function(){
                this.on('users_in_groups.group_id','=','choregroup.group_id')
                .onIn('choregroup.group_id',
                    db.select('users_in_groups.group_id')
                    .from('users_in_groups')
                    .where('users_in_groups.user_id','=',req.session.user_id))
            })
            .leftJoin('chore', function() {
                this.on('users.user_id','=','chore.assign_id').andOn('choregroup.group_id','=','chore.group_id')
            })
            .where('users.user_id', 'IN', 
                db.select('users_in_groups.user_id')
                .from('users_in_groups')
                .where('users_in_groups.group_id','IN',
                    db.select('users_in_groups.group_id')
                    .from('users_in_groups')
                    .where('users_in_groups.user_id','=',req.session.user_id)
                )
            )
            .then(data => {
                const organizedData = organizeChoreData(data, req.session.user_id);
                console.log(organizedData);
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
        db('chore')
            .where('chore_id', '=', req.body.choreID)
            .update({complete_date: 'now()'})
            .then(() => {
                //console.log('success')
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