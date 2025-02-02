const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto'); 

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter the name'],
        maxLength: [30, 'Name cannot exceed 30 characters'],
        minLength: [4, 'Name should have more than 4 characters']
    },

    email: {
        type: String,
        required: [true, 'Please enter the email'],
        unique: true,
        validate: [validator.isEmail, 'Please enter a valid email']
    },

    password: {
        type: String,
        required: [true, 'Please enter the password'],
        minLength: [8, 'Password should be of at least 8 characters'],
        select: false
    },

    admin: {
        type: Boolean,
        default: false
    },

    createdAt: {
        type: Date,
        default: Date.now
    },

    resetPasswordToken: String,
    resetPasswordExpire: Date
});

// Hash 
UserSchema.pre('save', async function (next) {
    if(!this.isModified('password')) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10)
})

// JWT Token, To generate + store token in cookies
UserSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    }) // Making TOken
}

UserSchema.methods.getResetPasswordToken = function () {
    const resetPassword = crypto.randomBytes(20).toString('hex');

    const tokenCrypto = crypto
    .createHash('sha256')
    .update(resetPassword)
    .digest('hex');

    this.resetPasswordToken = tokenCrypto;
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    return resetPassword;
}

UserSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

module.exports = mongoose.model('user', UserSchema);