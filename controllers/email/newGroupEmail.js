const fetch = require('node-fetch');
const token  = require('../../util/token');

const newGroupEmail = async (emails, groupName) => {
    const toke = await token.createToken(emails).catch(err => console.log(err))
    fetch(`${process.env.EMAIL_URL}newgroup`, { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${toke}`
        },
        body: JSON.stringify({
            groupName,
            emails
        })
    })
    .then(response => response.json())
    .then(res => {
        console.log('Created new group email server response - ',res);
        return true;
    })
    .catch(err => console.log(err))
}

module.exports = {
    newGroupEmail
}