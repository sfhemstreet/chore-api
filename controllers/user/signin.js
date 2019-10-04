// HANDLE USER SIGN IN
const signin = (req,res,db,bcrypt) => {
    const {email, password} = req.body;
    // DO MORE CHECKS HERE
    if(!email || !password){
        return res.status(400).json('Wrong Credentials')
    }
    // compares db hash pw to sent in pw
    db.select('hash','verified').from('login')
        .where('email', '=', email)
        .then(data => {
            if(!data[0]){
                return res.status(400).json('Wrong Credentials')
            }
            if(!data[0].verified){
                return res.status(400).json('Account has not been verified, check your email and click the verification link we sent you.');
            }
            bcrypt.compare(password, data[0].hash)
            .then(pass => {   
                if(pass){
                    // pw matched, get user info
                    return db.select('email', 'score', 'user_name', 'user_id').from('users')
                        .where('users.email','=',email)
                        .then(userInfo => {
                            const {email, score, user_name, user_id} = userInfo[0];
                            // data we send to user
                            const user_data = {user_name, email, score};
                            // set session user_id
                            req.session.user_id = user_id;
                            res.json({
                                userData: user_data,
                            }) 
                        })
                        .catch(error => {
                            console.log(error)
                            res.status(400).json('Unable to get user')
                        })
                }
                else{
                    res.status(400).json('Wrong Credentials')
                }
            })
            .catch(error => res.status(400).json('Wrong Credentials'))
        })
        .catch(error => {
            console.log(error)
            res.status(400).json('Wrong Credentials')
        }
    );
}

module.exports = {
    signin
}