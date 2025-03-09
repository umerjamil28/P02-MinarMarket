const catchAsyncErrors = require("../middleware/CatchAsyncErrors.js");
const mongoose = require("mongoose");
const User = require("../models/User.js");
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const path = require('path');
const dotenv = require('dotenv');
const axios = require("axios");
const { options } = require("../app.js");

const HUNTER_API_KEY = "13e6059c626a6223222ed27a6b1f0627a4d87302"
require('dotenv').config({ path: path.resolve(__dirname, '../config/.env') });
dotenv.config();

exports.login = catchAsyncErrors(async (req, res, next) => {
  // console.log("Received login request"); // Debugging statement to confirm login request is received

  if (!req.body) {
    console.log("Request body is missing"); // Debugging statement if body is not provided
    return res.status(400).json({
      success: false,
      message: "Please enter your email and password",
    });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    console.log("Email or password missing"); // Debugging statement for missing credentials
    return res
      .status(400)
      .json({ success: false, message: "Please enter email and password" });
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    console.log("User not found"); // Debugging statement if user does not exist
    return res
      .status(401)
      .json({ success: false, message: "Invalid email or password" });
  }

  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    console.log("Password did not match"); // Debugging statement if password is incorrect
    return res
      .status(401)
      .json({ success: false, message: "Invalid email or password" });
  }

  // Include user name and email in the JWT payload
  const payload = {
    id: user._id,
    name: user.name, 
    email: user.email,
    admin: user.admin,
    accountStatus: user.accountStatus
  };

  // Generate token with a payload that includes name and email
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
  return res.status(200).json({ success: true, token });
});

exports.signup = catchAsyncErrors(async (req, res, next) => {
  console.log("Received signup request");

  if (!req.body) {
      return res.status(400).json({ success: false, message: "Missing request body" });
  }

  const { email, phone, password, confirmPassword, name } = req.body;

  if (!email || !phone || !password || !confirmPassword || !name) {
      return res.status(400).json({ success: false, message: "Please enter all required fields" });
  }

  if (!/^\d{10,15}$/.test(phone)) {
      return res.status(400).json({ success: false, message: "Invalid phone number format" });
  }

  if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: "Passwords do not match" });
  }
  
  try {
    const hunterResponse = await axios.get(`https://api.hunter.io/v2/email-verifier`, {
        params: {
            email: email,
            api_key: HUNTER_API_KEY,
        }
    });

    const verificationData = hunterResponse.data.data;

    if (verificationData.status !== "valid") {
        return res.status(400).json({ success: false, message: "Invalid email address" });
    }
} catch (error) {
    console.error("Hunter API Error:", error.message);
    return res.status(500).json({ success: false, message: "Email verification service failed" });
}


  const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
  if (existingUser) {
      return res.status(400).json({ success: false, message: "User with this email or phone number already exists" });
  }
  

  try {
      //const newUser = await User.create({ name, email, phone, password });
      console.log("User created successfully:");
      return res.status(200).json({ success: true, message: "User registered successfully" });
  } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
  }
});






exports.sendotp = async (req, res, next) => {
  
  try {
    const { email, otp } = req.body; // OTP comes from the request
    console.log(email, otp)
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: "Email and OTP are required" });
    }

    // Create transporter for email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "MinarMarket - OTP Verification",
      text: `Your OTP code is: ${otp}`,
      html: `
        <h2>MinarMarket - OTP Verification</h2>
        <p>Your OTP code is: <strong style="color: blue;">${otp}</strong></p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);
    console.log("OTP Email sent to:", email);

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("Error sending OTP email:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send OTP email.",
    });
  }
};


exports.signup_post = async (req, res, next) => {
  try{
    
    const { name, email, phone, password } = req.body;
    console.log(name, email, phone, password )
    const newUser = await User.create({
      name,
      email,
      phone,
      password, // Store hashed password
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully!",
      user: { id: newUser._id, name: newUser.name, email: newUser.email },
    }) } catch (error) {
      console.error("Signup error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error. Please try again later.",
      });
    }
  }


