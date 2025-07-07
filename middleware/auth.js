const jwt = require("jsonwebtoken");

// Middleware to protect routes
exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1]; // Format: "Bearer <token>"

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access token missing. Login required.",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decodedUser) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: "Invalid or expired token. Please log in again.",
      });
    }

    // Attach decoded user info (id, email, role, etc.) to request
    req.user = decodedUser;
    next();
  });
};
