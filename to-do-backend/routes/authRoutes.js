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
const { isAuthenticated } = require("../middleware/authMiddleware");
const router = express.Router();

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER, // Gmail email
    pass: process.env.MAIL_APP_PASSWORD, // App-specific password
  },
});


// **REGISTER USER**
// **REGISTER USER**
router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists, Please login !" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user without Google Authenticator secret at this point
    const user = new User({
      email,
      password: hashedPassword,
    });

    await user.save();

    const mailCode = Math.floor(Math.random() * 999999)
      .toString()
      .padStart(6, "0");

    // Expiration time for the mail code (2 minutes)
    const expirationTime = Date.now() + 2 * 60 * 1000;

    // Send a registration confirmation email
    await transporter.sendMail({
      to: email,
      subject: "Welcome to To-do App!",
      text: `Hello ${email},\n\nThank you for registering on To-do App.\n\nYou can now log in using your credentials and set up Two-Factor Authentication (2FA) for added security.\n\nBest regards,\nThe To-do App Team. Your code is ${mailCode}`,
    });

    // Save the mail code to user
    user.mailCode = mailCode;
    user.mailCodeExpirationTime = expirationTime;
    await user.save();

    res.status(201).json({
      message: "User registration successful! A confirmation email has been sent.",
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Server error" });
  }
});



// **LOGIN WITH MAIL - 2 STEP**
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

    // Generate 6-digit mail code
    const mailCode = Math.floor(Math.random() * 999999)
      .toString()
      .padStart(6, "0");

    // Expiration time (2 minutes)
    const expirationTime = Date.now() + 2 * 60 * 1000;

    // Send email with code
    await transporter.sendMail({
      to: email,
      subject: "Your Login Code for To-do App",
      text: `Your code is ${mailCode}`,
    });

    user.mailCode = mailCode;
    user.mailCodeExpirationTime = expirationTime;
    await user.save();

    res.status(200).json({
      message: "Please check your email for the verification code",
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});


// **VERIFY MAIL CODE**
router.post("/verify-mail-code", async (req, res) => {
  const { email, mailCode } = req.body;
  const user = await User.findOne({ email });

  if (!user || user.mailCode !== mailCode) {
    return res.status(400).json({ message: "Invalid mail code" });
  }

  if (Date.now() > user.mailCodeExpirationTime) {
    return res.status(400).json({ message: "Mail code expired" });
  }

  // Generate Google Authenticator Secret and Save to DB
  const secret = speakeasy.generateSecret({ name: `To-do-app:${email}` });
  const otpauthUrl = secret.otpauth_url; // Correct way to get the QR Code URL

  user.mailCode = null;
  user.mailCodeExpirationTime = null;
  user.twoFactorSecret = secret.base32; // Save secret to database
  await user.save();

  res.status(200).json({
    message: "Mail code validated. Please enter your Google Authenticator code.",
    otpauthUrl, // Send otpauth URL for frontend QR Code
  });
});


// **VERIFY 2FA**
router.post("/verify-2fa", async (req, res) => {
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

    // Generate JWT token after successful 2FA
    const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    res.cookie('auth_token', jwtToken, {
      httpOnly: true, // Prevents JS access
      secure: process.env.NODE_ENV === 'production', // Secure flag for production
      maxAge: 2 * 60 * 60 * 1000, // Expiry time (2 hours)
      path: '/', // Set the correct path
    });
    

    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// CHECK USER
// CHECK USER
router.get("/me", async (req, res) => {
  console.log("Cookies Received:", req.cookies); // Debugging
  
  const token = req.cookies.auth_token;
  if (!token) {
    return res.status(401).json({ message: "Not logged in" });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find the user to get their complete profile including Google info
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Return user data including Google connection status
    res.status(200).json({
      message: "User authenticated",
      userId: decoded.userId,
      email: user.email,
      google: {
        connected: !!user.google.connected,
        email: user.google.email || null
      },
      isTwoFactorEnabled: !!user.isTwoFactorEnabled
    });
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
});





// **Google OAuth Login**
router.get("/google",isAuthenticated, googleAuth);

// **Google OAuth Callback**
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login", session: true }),
  googleAuthCallback
);

// **Logout**
router.get("/logout", logoutUser);

module.exports = router;
