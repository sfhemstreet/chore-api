const fetch = require('node-fetch');
const token  = require('../util/token');

const newGroupEmail = async (emails, groupName) => {
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
        console.log('Add chores email server res - ',res);
        return true;
    })
    .catch(err => console.log(err))
}


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


sendVerifyEmail = async (userData, verifyStr) => {
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
    newGroupEmail,
    addedChoresEmail,
    sendVerifyEmail,
    forgotPasswordEmail
}