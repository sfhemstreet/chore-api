const handleSignin = (req,res,db, bcrypt) => {
    const {email, password} = req.body;
    if(!email || !password){
        return res.status(400).json('Incorrect Signin Submission')
    }
    db.select('hash').from('login')
        .where('email', '=', email)
        .then(data => {
            bcrypt.compare(password, data[0].hash)
            .then(pass => {   
                if(pass){
                    return db.select('*').from('users as u')
                        .where('u.email','=',email)
                        .then(user => {
                            res.json(user[0])
                        })
                        .catch(error => res.status(400).json('Unable to get user'))
                }
                else{
                    res.status(400).json('Error in Signin Information')
                }
            })
            .catch(error => res.status(400).json('Bad '))
               
        })
        .catch(error => {
            console.log(error)
            res.status(400).json('Wrong Credentials')}
        );
}

module.exports = {
    handleSignin: handleSignin
}
