const {todaysDate} = require('../util/todaysDate');
const {createUser} = require('../util/createUser');

const createGroup = async (req,res,db,bcrypt) => {
    if(req.session.user_id){
        const {groupName, users, chores} = req.body;
        console.log('$$$ groupname',groupName)
        console.log('$$$ users',users)
        console.log('$$$ chores',chores)
        // check if group exists already
        db.select('group_name').from('choregroup')
        .where('created_by','=',req.session.user_id).andWhere('group_name','=',groupName)
        .then(result => {
            if(result[0]){
                return res.status(400).json('Group Already Exists')
            }
            else{
                // insert new group into choregroup
                    // groupName, the ID of this user, and the email associated with this user
                    // return the group_id
                /* 
                INSERT INTO choregroup (group_name, created_by, created_date )
                VALUES ('camilles apt', 28 , '2019-05-24');
                */
                return db.select('email').from('users').where('user_id', '=', req.session.user_id).then(users_email => {
                    console.log('1 users_email',users_email);
                    db.insert({
                        group_name : groupName,
                        created_by : req.session.user_id,
                        created_by_email : users_email[0].email,
                        created_date : todaysDate()
                    }) 
                    .into('choregroup').returning('group_id')
                    .then(groupID => {
                        console.log('2 new groupID', groupID);
                        // check if users are already in DB (check users table)
                            // true - get userID from users table and add to users_in_group - user_id, group_id, email
                                // return the user_id
                            // false - create new user with the given email, 
                                // - give strong random password, 
                                // - create username ie email minus everything after @
                                // ADD NEW USER TO users_in_groups
                                // return user_id
                        
                        let emailsWithIds = {}
                        function processEmails(){
                            console.log(Object.keys(users).length)
                            let counter = 0;
                            for(const email in users){
                                console.log('3 for loop stuff',email)
                                db.select('user_id').from('users').where('email','=',email)
                                .then(id => {
                                    console.log('4 ids',id)
                                    if(id[0]){
                                        emailsWithIds[email] = id[0].user_id;
                                        db.insert({
                                            group_id : groupID[0],
                                            user_id : id[0].user_id,
                                            user_email : email
                                        })
                                        .into('users_in_groups').then().catch(err => console.log('users_in_groups insert error', err));
                                        counter++;
                                    }
                                    else{
                                        console.log('user does not exist')
                                        // create new user return the userID
                                        createUser(email,db,bcrypt).then(newID => {
                                            db.insert({
                                                group_id : groupID[0],
                                                user_id : newID,
                                                user_email : email
                                            })
                                            .into('users_in_groups').then().catch(err => console.log('new user insert error', err));
                                            counter++;
                                        }).catch(err => console.log(error));
                                    }
                                    if(counter === Object.keys(users).length){
                                        processChores();
                                    }
                                }).catch(err => console.log('error at id',err));
                                
                            } 
                        
                        }
                        
                        function processChores(){
                            // put chores into chores table
                            for(let c in chores){
                                db.insert({
                                    chore_name : c,
                                    assign_date : todaysDate(),
                                    due_date : chores[c].dueDate,
                                    group_id : groupID[0],
                                    assign_id : emailsWithIds[chores[c].assigned],
                                    description : chores[c].description
                                })
                                .into('chore').then().catch(err => console.log('error at chore insert', err))
                            } 
                            // if successful
                            res.json('Group Created')
                        }
                        processEmails();  
                    }).catch(err => console.log('group_id failed',err))
                }).catch(err => console.log('user email failed',err));        
            }
        });
    }
    else{
        res.status(403).json('MUST LOGIN');
    }
}

module.exports = {
    createGroup
}