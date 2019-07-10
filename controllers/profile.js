const handleGetAllGroups = (req,res,db) => {

    // see if user has session
    if(req.session.user_id){
        return db.select('choregroup.group_id')
            .from('choregroup')
            .join('chore', 'choregroup.group_id','=','chore.group_id')
            .join('users','users.user_id','=','chore.assign_id')
            .where('users.user_id', '=', req.session.user_id)
            .returning(groupID => {
                db.select('users.user_name AS assign_name', 
                    'users.email AS assign_email',
                    'chore.chore_name',
                    'chore.assign_date', 
                    'chore.due_date', 
                    'chore.complete_date', 
                    'choregroup.group_name').from('chore')
                    .join('choregroup','choregroup.group_id','=','chore.group_id')
                    .join('users','chore.assign_id','=','users.user_id')
                    .where('choregroup.group_id','=', groupID)
                    .then(data => {
                        res.json({
                            groups: data
                        })  
                    })
                    .catch(error => {
                        console.log(error)
                        res.status(400).json('session problem')
                    });
            })
        
        
    }
    else{
        res.status(403).json('BOI')
    }
    


}

module.exports = {
    handleGetAllGroups: handleGetAllGroups
}