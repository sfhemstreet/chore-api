const {newGroupEmail, addedChoresEmail} = require('../email/email');

// DELETE GROUP 
const deleteGroup = (req,res,db) => {
    if(req.session.user_id){
        const {groupID} = req.body;
        db('groups')
        .where('group_id','=',groupID)
        .del()
        .then(() => {
            res.status(200).json('Group Deleted');
        })
        .catch(err => console.log(err))
    }
    else{
        res.status(403).json('MUST LOGIN');
    }
}

module.exports = {
    deleteGroup
}