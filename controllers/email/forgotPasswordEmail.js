const fetch = require('node-fetch');
const token  = require('../../util/token');

const forgotPasswordEmail = async (email,string) => {
    const toke = await token.createToken(email).catch(err => console.log(err))
    fetch('process.env.EMAIL_URLforgotpassword', { 
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