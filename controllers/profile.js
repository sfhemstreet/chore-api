const parseData = require('../util/parseData');

const handleGetAllGroups = (req,res,db) => {
    console.log('req.session at profile',req.session.user_id)
    
    // see if user has session
    if(req.session.user_id){
        // get all chores from groups associated with this user  
        return db.select('choregroup.group_id')
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
                    .where(() => {
                        for(let x = 0; x < groupID.length; x++){
                            ('choregroup.group_id','=', groupID[x].group_id)
                        }
                    }) // THIS NEEDS TO GET ALL GROUPS!
                    .then(data => {
                        console.log(data)
                        // organize chore data into groups
                        //const organizedGroups = parseData.organizeGroupData(data)
                        res.json({
                            groups: data//organizedGroups
                        })  
                    })
                    .catch(error => {
                        console.log(error)
                        res.status(400).json('session problem')
                    });
            })
        
        
    }
    else{
        console.log(req.session.user_id)
        res.status(403).json('BOI')
    }
    


}

module.exports = {
    handleGetAllGroups: handleGetAllGroups
}