const {newGroupEmail} = require('../email/email');

// EDIT GROUP - change permissions, add/remove members
const editGroup = (req,res,db) => {
    if(req.session.user_id){
        const {groupID, groupName, newMembers, removedMembers, updatedMembers} = req.body;
        // insert new members
        for(let m in newMembers){
            // check to see if person is already in group
            db.select('*').from('users_in_groups').where('group_id','=',groupID).andWhere('user_email','=',m)
            .then(data => {
                if(!data[0]){
                    db.insert({
                        group_id : groupID,
                        user_email : m,
                        auth : newMembers[m]
                    })
                    .into('users_in_groups').then(() => {
                        newGroupEmail([m],groupName);
                    }).catch(err => console.log('users_in_groups insert error', err));
                }
            })
            .catch(err => cpnsole.log(err))
        }
        // update persmissions
        for(let m in updatedMembers){
            db('users_in_groups')
            .where('user_email','=',m)
            .andWhere('group_id','=',groupID)
            .update({
                auth : updatedMembers[m]
            })
            .then().catch(err => console.log('users_in_groups update error', err));
        }
        // remove members from group
        if(removedMembers.length){
            db('users_in_groups')
            .whereIn('user_email',removedMembers)
            .andWhere('group_id', '=',groupID)
            .del()
            .then(() => {
                return res.status(200).json('Group Edited')
            })
            .catch(err => console.log(err))
        }
        else{
            return res.status(200).json('Group Edited');
        }
    }
    else{
        return res.status(403).json('MUST LOGIN');
    }
}

module.exports = {
    editGroup
}