const fetch = require('node-fetch');
const token  = require('../util/token');

const newGroupEmail = (emails, groupName) => {
    const data = {emails,groupName};
    fetch('http://localhost:5000/newgroup', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token.createToken(data)}`
        }
    })
    .then(response => response.json())
    .then(res => {
        console.log('Created new group email server response - ',res)
    });
}

const addedChoresEmail = (emails,groupName,chores) => {
    const data = {emails,groupName,chores};
    fetch('http://localhost:5000/addedchores', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token.createToken(data)}`
        }
    })
    .then(response => response.json())
    .then(res => {
        console.log('Added chores email server response - ',res)
    });
}

/*
const forgotPasswordEmail = (email,tempPassword) => {

}
*/

module.exports = {
    newGroupEmail,
    addedChoresEmail
}