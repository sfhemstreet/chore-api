const {createTempPassword} = require('./createTempPassword')

const createUser = (email,db,bcrypt) => {
    const tempPassword = createTempPassword();
    const tempUsername = email.slice(0, email.indexOf('@'));

    return new Promise((res, rej) => {
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
                    trx('users')
                    .insert({
                        user_id: loginID[0],
                        email: email,
                        user_name: tempUsername,
                        joined: new Date() 
                    })
                    .returning('user_id')
                    .then(userID => {
                        console.log(userID);
                        res(userID);
                    }) 
                    .catch(error => console.log(error))
                })
                .then(trx.commit)
                .catch(trx.rollback)
            })
            .catch(error => console.log(error)) 
        })          
    })
    
}

module.exports = {
    createUser
}