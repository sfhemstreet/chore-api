const {todaysDate} = require('../../util/todaysDate');
const {newGroupEmail} = require('../email/email');

// CREATE NEW GROUP
const createGroup = async (req,res,db) => {
    try{
        if(req.session.user_id){
            const {groupName, users, chores} = req.body;
            // check if group exists already
            db.select('group_name').from('groups')
            .where('created_by','=',req.session.user_id).andWhere('group_name','=',groupName)
            .then(result => {
                if(result[0]){
                    return res.status(400).json('Group Already Exists')
                }
                // Insert group into groups table - returning the new group_id
                // add all users to users_in_groups table
                // add new chores to chores table
                // email all all group members that they are part of a new group
                db.select('email').from('users').where('user_id', '=', req.session.user_id)
                .then(users_email => {
                    // insert the new group
                    db.insert({
                        group_name : groupName,
                        created_by : req.session.user_id,
                        created_by_email : users_email[0].email,
                        created_date : todaysDate()
                    }) 
                    .into('groups').returning('group_id')
                    .then(groupID => {
                        // insert users_in_groups information for each user
                        for(const email in users){
                            db.insert({
                                group_id : groupID[0],
                                user_email : email,
                                auth : users[email]
                            })
                            .into('users_in_groups').then().catch(err => console.log('users_in_groups insert error', err));
                        } 
                        // insert chores into DB   
                        for(let c in chores){
                            db.insert({
                                chore_name : c,
                                assign_date : todaysDate(),
                                due_date : chores[c].dueDate,
                                group_id : groupID[0],
                                assign_email : chores[c].assigned,
                                description : chores[c].description
                            })
                            .into('chores').then().catch(err => console.log('error at chore insert', err))
                        } 
                        // if successful
                        res.json('Group Created');
                        
                        return newGroupEmail(Object.keys(users), groupName);
                    });
                });
            });
        }
        else{
            res.status(403).json('MUST LOGIN');
        }    
    }
    catch(error){
        console.log(error);
    }
}

module.exports = {
    createGroup
}