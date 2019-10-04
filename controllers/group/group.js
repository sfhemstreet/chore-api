const cg = require('./createGroup');
const ac = require('./addChores');
const eg = require('./editGroup');
const dg = require('./deleteGroup');

// CREATE NEW GROUP
const createGroup = (req,res,db) => {cg.createGroup(req,res,db)}

// ADD CHORES TO EXISTING GROUP
const addChores = (req,res,db) => {ac.addChores(req,res,db)}

// EDIT GROUP - change permissions, add/remove members
const editGroup = (req,res,db) => {eg.editGroup(req,res,db)}

// DELETE GROUP 
const deleteGroup = (req,res,db) => {dg.deleteGroup(req,res,db)}

module.exports = {
    createGroup,
    addChores,
    deleteGroup,
    editGroup
}