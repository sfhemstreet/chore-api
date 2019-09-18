const fetch = require('node-fetch');

const newGroupEmail = (emails, groupName) => {
    fetch('http://localhost:5000/newgroup', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            groupName,
            emails
        })
    })
    .then(response => response.json())
    .then(res => {
        console.log(res)
    });
}

const addedChoresEmail = (emails,groupName,chores) => {
    fetch('http://localhost:5000/addedchores', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            groupName,
            emails,
            chores 
        })
    })
    .then(response => response.json())
    .then(res => {
        console.log(res)
    });
}

module.exports = {
    newGroupEmail,
    addedChoresEmail
}