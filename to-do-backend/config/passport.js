const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");
const dotenv = require("dotenv");

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://to-do-backend-liard.vercel.app/api/auth/google/callback",
      passReqToCallback: true, // ✅ Ensures we can access req in callback
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ "google.id": profile.id });

        if (!user) {
          // Check if user exists by email
          user = await User.findOne({ email: profile.emails[0].value });

          if (user) {
            // ✅ If user exists, update their Google info
            user.google.id = profile.id;
            user.google.email = profile.emails[0].value;
            user.google.accessToken = accessToken;
            user.google.refreshToken = refreshToken;
            user.google.connected = true;
            await user.save();
          } else {
            // ✅ Create new user with Google account
            user = new User({
              email: profile.emails[0].value,
              google: {
                id: profile.id,
                email: profile.emails[0].value,
                accessToken,
                refreshToken,
                connected: true,
              },
            });
            await user.save();
          }
        } else {
          // ✅ If user exists, just update tokens
          user.google.accessToken = accessToken;
          user.google.refreshToken = refreshToken;
          await user.save();
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
