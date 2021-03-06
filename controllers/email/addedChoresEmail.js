const fetch = require('node-fetch');
const token  = require('../../util/token');

const addedChoresEmail = async (groupName,chores,emails) => {
    const toke = await token.createToken(emails).catch(err => console.log(err))
    fetch(`${process.env.EMAIL_URL}addchores`, { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + toke
        },
        body: JSON.stringify({
            groupName,
            emails,
            chores 
        })
    })
    .then(response => response.json())
    .then(res => {
        console.log('Add chores email server res - ',res);
        return true;
    })
    .catch(err => console.log(err))
}

module.exports = {
    addedChoresEmail
}