// Register new user - hash pw, insert into DB at login and users tables 
const handleRegister = (req,res,db,bcrypt) => {
    const {email, password, username} = req.body;
    // do more checks for bad input here!!!
    if(!email || !password || !username){
        return res.status(400).json('Invalid Register Info')
    }
    // Hash with salt set to 15
    bcrypt.hash(password, 15, (error, hashedPW) => {
        if(error){
            return res.status(400).json('Hash')
        }
        // transaction insurances both tables will be inserted into or neither will
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
                        user_name: username,
                        joined: new Date() 
                    })
                    .then(user => {
                        // respond with users table data
                        res.json(user[0]);
                    }) 
                    .catch(error => res.status(400).json('REGISTER ERROR'))
            })
            .then(trx.commit)
            .catch(trx.rollback)
        })
        .catch(error => {
            console.log('duplicate email',error)
            res.status(400).json('Duplicate Email')
        })       
    })
}

module.exports = {
    handleRegister: handleRegister
}