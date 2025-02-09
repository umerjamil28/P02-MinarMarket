const express = require('express');
const router = express.Router();

const { login, signup } = require('../controllers/UserAuthController');

router.route('/login').post(login); // I will be adding credentials to check if user is already logged in.
router.route('/signup').post(signup); // I will be adding credentials to check if user is already logged in.

module.exports = router;