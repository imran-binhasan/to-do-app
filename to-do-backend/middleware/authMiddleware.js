const jwt = require("jsonwebtoken");

const isAuthenticated = (req, res, next) => {
  console.log("JWT middleware executed: Checking auth_token cookie...");
  const token = req.cookies.auth_token;
  console.log("Received token:", token);

  if (!token) {
    console.log("No token provided!");
    return res.status(401).json({ message: "Not logged in" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded user:", decoded);
    req.user = decoded; // Attach decoded user data (e.g., userId) to the request
    return next();
  } catch (error) {
    console.log("Token verification failed:", error.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = { isAuthenticated };
