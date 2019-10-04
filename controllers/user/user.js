const s = require('./signin');
const r = require('./register');
const gc = require('./getChores');
const sc = require('./submitChore');
const da = require('./deleteAccount');
const cp = require('./changePassword');
const fp = require('./forgotPassword');

// SIGN IN
const signin = (req,res,db,bcrypt) => {s.signin(req,res,db,bcrypt)}

// REGISTER step 1/2
const register = (req,res,db,bcrypt) => {r.register(req,res,db,bcrypt)}

// REGISTER VERIFICATION step 2/2
const registerVerification = (req,res,db) => {r.verification(req,res,db)}

// GET CHORES - gets all chores associated with user 
const getChores = (req,res,db) => {gc.getChores(req,res,db)}

// SUBMIT CHORE - user submits chore, update complete_date in DB, increase user score 
const submitChore = (req,res,db) => {sc.submitChore(req,res,db)}

// DELETE ACCOUNT - auth user with given password then delete account
const deleteAccount = (req,res,db,bcrypt) => {da.deleteAccount(req,res,db,bcrypt)}

// CHANGE PASSWORD - auth user with oldPassword and update db to newPassword
const changePassword = (req,res,db,bcrypt) => {cp.changePassword(req,res,db,bcrypt)}

// FORGOT PASSWORD - initiates forgot password ie creates str in db and tells email server to send email
const initForgotPassword = (req,res,db) => {fp.initForgotPassword(req,res,db)}

// CHECK AUTH FORGOT PASSWORD - checks if user on frontend is legit when trying to reset the password
const checkAuthForgotPassword = (req,res,db) => {fp.checkAuthForgotPassword(req,res,db)}

// RESET FORGOT PASSWORD - only accept with cookie auth from legit user, updates password deletes str in db
const resetForgotPassword = (req,res,db,bcrypt) => {fp.resetForgotPassword(req,res,db,bcrypt)}

module.exports = {
    signin,
    register,
    registerVerification,
    getChores,
    submitChore,
    deleteAccount,
    changePassword,
    initForgotPassword,
    resetForgotPassword,
    checkAuthForgotPassword
}