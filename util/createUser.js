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
            db.insert({
                email: email,
                hash: hashedPW
            })
            .into('login')
            .returning('login_id')
            .then(loginID => {
                db.insert({
                    user_id: loginID[0],
                    email: email,
                    user_name: tempUsername,
                    joined: new Date() 
                })
                .into('users')
                .returning('user_id')
                .then(userID => {
                    console.log(userID[0]);
                    return userID[0];
                }) 
                .catch(error => console.log(error))
            })
            .catch(err => console.log(err));
        })        
    }
    catch(error){
        console.log(error);
    }
    
}

module.exports = {
    createUser
}