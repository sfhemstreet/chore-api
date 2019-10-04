const nge = require('./newGroupEmail');
const ace = require('./addedChoresEmail');
const fpe = require('./forgotPasswordEmail');
const rve = require('./registerVerificationEmail');
const da = require('./deleteAccountEmail');

// new group email 
const newGroupEmail = (emails, groupName) => {nge.newGroupEmail(emails, groupName)}

// added chores email 
const addedChoresEmail = (groupName,chores,emails) => {ace.addedChoresEmail(groupName,chores,emails)}

// forgot password email 
const forgotPasswordEmail = (email,string) => {fpe.forgotPasswordEmail(email,string)}

// register account verification email
const registerVerificationEmail = (userData, verifyStr) => {rve.registerVerificationEmail(userData,verifyStr)}

// delete account email
const deleteAccountEmail = (email, username) => {da.deleteAccountEmail(email, username)}

module.exports = {
    newGroupEmail,
    addedChoresEmail,
    registerVerificationEmail,
    forgotPasswordEmail,
    deleteAccountEmail
}