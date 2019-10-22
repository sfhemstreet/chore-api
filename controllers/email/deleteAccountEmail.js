const fetch = require('node-fetch');
const token  = require('../../util/token');

const deleteAccountEmail = async (email, username) => {
    const toke = await token.createToken(email).catch(err => console.log(err))
    fetch(`${process.env.EMAIL_URL}deleteaccount`, { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + toke
        },
        body: JSON.stringify({
            email,
            username
        })
    })
    .then(response => response.json())
    .then(res => {
        console.log('Delete acoount email server res - ',res);
        return true;
    })
    .catch(err => console.log(err))
}

module.exports = {
    deleteAccountEmail
}