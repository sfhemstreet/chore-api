// user submits chore, update complete_date in DB, increase user score 
const submitChore = (req,res,db) => {
    if(req.session.user_id){
        db('chores')
        .where('chore_id', '=', req.body.choreID)
        .update({complete_date: 'now()'})
        .then(() => {
            db('users')
            .where('user_id','=',req.session.user_id)
            .increment('score',1)
            .then(() => {
                res.status(200).json('Chore Submitted');
            })
            .catch(err => {
                console.log('error at update score',err);
                res.status(400).json('error');
            })
        })
        .catch(err => {
            console.log('error at update complete date',err);
            res.status(400).json('error');
        })
    }   
    else{
        res.status(403).json('MUST LOGIN')
    }
}

module.exports = {
    submitChore
}