const {organizeChoreData} = require('../util/organizeChoreData.js');

const getChores = (req,res,db) => {
    // see if user has session
    if(req.session.user_id){
        // get all chores from groups associated with this user  
        return  db.select(
            'users.user_id',
            'choregroup.created_by',
            'users.user_name AS assign_name', 
            'users.email AS assign_email',
            'chore.chore_id',
            'chore.chore_name',
            'chore.assign_date', 
            'chore.due_date', 
            'chore.complete_date',
            'chore.description', 
            'choregroup.group_name',
            'choregroup.created_by_email')
            .from('chore')
            .join('choregroup','choregroup.group_id','=','chore.group_id')
            .join('users','chore.assign_id','=','users.user_id')
            .where('choregroup.group_id', 'IN', 
                db.select('choregroup.group_id')
                .from('choregroup')
                .join('chore','choregroup.group_id','=','chore.group_id')
                .join('users','users.user_id','=','chore.assign_id')
                .where('users.user_id','=',req.session.user_id)
                .orWhere('choregroup.created_by','=',req.session.user_id)
            )
            .then(data => {
                const organizedData = organizeChoreData(data, req.session.user_id);
                //console.log(organizedData);
                res.json({
                    chores: organizedData
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
                console.log('success')
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