const express = require("express");
const bcrypt = require("bcryptjs");
const speakeasy = require("speakeasy");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const {
  googleAuth,
  googleAuthCallback,
  logoutUser,
} = require("../controllers/authController");
const passport = require("passport");
const router = express.Router();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    password: process.env.MAIL_PASSWORD,
  },
});

// User Registraion
router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: "User registration successful !" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Login with Mail - 2 Step
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    // 6 Digit code generate
    const mailCode = Math.floor(Math.random() * 999999)
      .toString()
      .padStart(6, "0");

    // Valid for 2 min only
    const expirationTime = Date.now() + 2 * 60 * 1000;

    await transporter.sendMail({
      to: email,
      subject: "Your Login Code for To-do App",
      text: `Your code is ${mailCode}`,
    });

    user.mailCode = mailCode;
    user.mailCodeExpirationTime = expirationTime;
    await user.save();
    res
      .status(200)
      .json({ message: "Please check your email for the verification code" });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

// Verify Google Authenticator
router.post("/verify-2f", async (req, res) => {
  const { email, token } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Verify with speakeasy
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: "base32",
      token,
    });
    if (!verified) {
      return res.status(400).json({ message: "Invalid 2FA code" });
    }
    // Generate JWT token after verification
    const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });
    res.status(200).json({ message: "Login successful", token: jwtToken });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Google OAuth Login
router.get("/google", googleAuth);

// Google OAuth Callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login", session: true }),
  googleAuthCallback
);

// Logout
router.get('/logout', logoutUser);

module.exports = router;
