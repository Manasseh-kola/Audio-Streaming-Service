const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/authenticateUser');
const { 
    login, 
    signUp, 
    verifyEmail,
    logout,
    resetPassword,
    forgotPassword
 } = require("../controllers/auth");

//Authentification routes
router.route('/register').post(signUp);
router.route('/verify-email').post(verifyEmail);
router.route('/login').post(login);
router.route('/reset-password').post(resetPassword);
router.route('/forgot-password').post(forgotPassword);
router.route('/logout').delete(logout,authenticateUser);

module.exports = router;

