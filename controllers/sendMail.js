const fetch = require('node-fetch');
const token  = require('../util/token');

const newGroupEmail = async (emails, groupName) => {
    console.log('sending mail')
    const toke = await token.createToken(emails);
    fetch('http://localhost:5000/newgroup', { 
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

const addedChoresEmail = async (groupName,chores,emails) => {
    const toke = await token.createToken(emails)
    console.log('here it is',toke)
    fetch('http://localhost:5000/addchores', { 
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
        console.log('Added chores email server response - ',res);
        return true;
    })
    .catch(err => console.log(err))
}

/*
const forgotPasswordEmail = (email,tempPassword) => {

}
*/

module.exports = {
    newGroupEmail,
    addedChoresEmail
}