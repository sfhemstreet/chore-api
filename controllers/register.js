const handleRegister = (req,res,db,bcrypt) => {
    const {email, password, username} = req.body;
    if(!email || !password || !username){
        return res.status(400).json('Invalid Register Info')
    }
    // INSERT NEW USER INFO
    bcrypt.hash(password, 15, (error, hashedPW) => {
        if(error){
            return res.status(400).json('Hash')
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
                        user_name: username,
                        joined: new Date() 
                    })
                    .then(user => {
                        console.log(user[0])
                        res.json(user[0]);
                    }) 
                    .catch(error => res.status(400).json('REGISTER ERROR'))
            })
            .then(trx.commit)
            .catch(trx.rollback)
        })
        .catch(error => {
            res.status(400).json('Duplicate Email')
        })       
    })
}

module.exports = {
    handleRegister: handleRegister
}