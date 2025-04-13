const express = require('express');
const router = express.Router();

const { login, signup, sendotp, signup_post } = require('../controllers/UserAuthController');

router.route('/login').post(login); // I will be adding credentials to check if user is already logged in.
router.route('/signup').post(signup);
router.route('/signup-post').post(signup_post); // I will be adding credentials to check if user is already logged in.
router.route('/').post(sendotp);
module.exports = router;
