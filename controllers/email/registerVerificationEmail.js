const fetch = require('node-fetch');
const token  = require('../../util/token');

const registerVerificationEmail = async (userData, verifyStr) => {
    const {email, user_name} = userData;
    const toke = await token.createToken(email);
    fetch('http://localhost:5000/verifyuseremail', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${toke}`
        },
        body: JSON.stringify({
            user_name,
            email,
            verifyStr 
        })
    })
    .then(response => response.json())
    .then(res => {
        console.log('Verify email email server res - ',res);
        return true;
    })
    .catch(err => console.log(err))

}

module.exports = {
    registerVerificationEmail
}