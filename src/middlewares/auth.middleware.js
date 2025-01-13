const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  try {
    if (!token) {
      return res.status(403).json({ message: "Access denied, token missing" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Invalid token" });
      }
      req.user = user;
      next();
    });
  } catch (error) {
    res.status(401).json({ message: "Unauthorized", error });
  }
};
