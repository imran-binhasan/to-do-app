const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Not required for Google users
  google: {
    id: { type: String, default: null },
    email: { type: String, default: null },
    accessToken: { type: String, default: null },
    refreshToken: { type: String, default: null },
    connected: { type: Boolean, default: false },
  },
  twoFactorSecret: { type: String, default: null },
  isTwoFactorEnabled: { type: Boolean, default: false },
  mailCode: { type: String, default: null },
  mailCodeExpirationTime: { type: Date },
});

module.exports = mongoose.model("User", UserSchema);
