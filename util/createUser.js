const {createTempPassword} = require('./createTempPassword')

const createUser = async(email,db,bcrypt) => {
    try{
        const tempPassword = createTempPassword();
        const tempUsername = email.slice(0, email.indexOf('@'));
        //sendNewUserEmail(tempUsername, tempPassword);
        bcrypt.hash(tempPassword, 15, (error, hashedPW) => {
            if(error){
                return console.log(error)
            }
            db.transaction(trx => {
                trx.insert({
                    email: email,
                    hash: hashedPW
                })
                .into('login')
                .returning('login_id')
                .then(loginID => {
                    return trx('users')
                        .returning('*')
                        .insert({
                            user_id: loginID[0],
                            email: email,
                            user_name: tempUsername,
                            joined: new Date() 
                        })
                        .then(user => {
                            console.log(user[0])
                            res.json(user[0]);
                        }) 
                        .catch(error => console.log(error))
                })
                .then(trx.commit)
                .catch(trx.rollback)
            })
            .catch(error => {
                console.log('error in createUser transaction', error)
            })
        })        
    }
    catch(error){
        console.log(error);
    }
    
}

module.exports = {
    createUser
}

    