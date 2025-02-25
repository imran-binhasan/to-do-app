const passport = require('passport')

const googleAuth = passport.authenticate('google', {
    scope:['email', 'profile']
  });
  
  const googleAuthCallback = (req, res) => {
    res.status(200).json({message: 'Google login successful', user:req.user})
  }

  const logoutUser = (req, res) => {
    req.logout((err) => {
        if(err) {
            return res.status(500).json({message:'Logout failed'})
        };
        res.status(200).json({message:'Logged out successfully'})
    });
  };

  module.exports = {googleAuth, googleAuthCallback, logoutUser}