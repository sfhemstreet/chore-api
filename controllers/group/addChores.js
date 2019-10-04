const {todaysDate} = require('../../util/todaysDate');
const {addedChoresEmail} = require('../email/email');

// ADD CHORES TO EXISTING GROUP
const addChores = (req,res,db) => {
    if(req.session.user_id){
        const {groupID, chores, emails} = req.body;
        // insert chores into DB   
        for(let c in chores){
            db.insert({
                chore_name : c,
                assign_date : todaysDate(),
                due_date : chores[c].dueDate,
                group_id : groupID,
                assign_email : chores[c].assigned,
                description : chores[c].description
            })
            .into('chores').then().catch(err => {
                res.json('Error');
                console.log('error at chore insert', err)
            });
        } 
        res.json('Chores Added');

        db.select('group_name')
        .from('groups')
        .where('group_id','=',groupID)
        .then(groupName => {
            return addedChoresEmail(groupName[0], chores, emails)
        })
        
    }
    else{
        res.status(403).json('MUST LOGIN');
    }
}

module.exports = {
    addChores
}