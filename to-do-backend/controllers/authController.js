const passport = require("passport");
const User = require("../models/User");

// Google Auth route
// Google Auth route
const googleAuth = passport.authenticate("google", {
  scope: ["email", "profile", "https://www.googleapis.com/auth/calendar"],
});

// Google Auth Callback
const googleAuthCallback = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Google login failed" });
  }

  try {
    // ✅ No need to fetch the user again, `req.user` already contains it
    const user = req.user;

    return res.status(200).json({
      message: user.google.connected ? "Google login successful" : "Google account linked successfully",
      user: {
        _id: user._id,
        email: user.email,
        google: {
          id: user.google.id,
          email: user.google.email,
          connected: user.google.connected,
        },
      }
      
    });
  } catch (error) {
    console.error("Error in Google callback:", error);
    res.redirect('https://to-do-task-00.netlify.app/settings?error=google_connection_failed');
  }
};

// Logout route
const logoutUser = (req, res) => {
  res.clearCookie("auth_token", {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  });
  res.clearCookie("connect.sid");

  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed", error: err });
    }

    res.status(200).json({ message: "Logged out successfully" });
  });
};

module.exports = { googleAuth, googleAuthCallback, logoutUser };
