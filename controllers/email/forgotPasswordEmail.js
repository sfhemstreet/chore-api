const fetch = require('node-fetch');
const token  = require('../../util/token');

const forgotPasswordEmail = async (email,string) => {
    console.log(email,string)
    const toke = await token.createToken(email);
    fetch('http://localhost:5000/forgotpassword', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${toke}`
        },
        body: JSON.stringify({
            email,
            string 
        })
    })
    .then(response => response.json())
    .then(res => {
        console.log('Reset Password email server res - ',res);
        return true;
    })
    .catch(err => console.log(err))
}


module.exports = {
    forgotPasswordEmail
}