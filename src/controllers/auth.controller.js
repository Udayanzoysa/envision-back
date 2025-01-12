const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { generateAccessToken, generateRefreshToken } = require("../utils/generateToken");

exports.register = async (req, res) => {
  const { first_name, last_name, full_name, email, phone, password, confirm_password, imgix_url, slug } = req.body;

  console.log(first_name, "firstName");
  console.log(last_name, "last_name");
  console.log(email, "email");
  console.log(full_name, "full_name");
  console.log(phone, "phone");
  console.log(password, "password");
  console.log(confirm_password, "confirm_password");

  try {
    if (!first_name || !last_name || !email || !phone || !password || !confirm_password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (password !== confirm_password) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({ first_name, last_name, full_name, email, phone, password: hashedPassword, imgix_url, slug });
    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "The email is not associated with any account. Please sign up" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials. Please check your email and password" });

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    res.cookie("accessToken", accessToken, {
      httpOnly: false,
      secure: false,
      sameSite: "Lax",
      path: "/",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: false,
      secure: false,
      sameSite: "Lax",
      path: "/",
    });
    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};

exports.verifyUser = async (req, res) => {
  const accessToken = req.cookies["accessToken"];
  try {
    if (!accessToken) {
      return res.status(401).json({ message: "Access token is required" });
    }

    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    const userID = decoded.id;
    const user = await User.findOne({ where: { id: userID } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const roles = user.role ? (Array.isArray(user.role) ? user.role : [user.role]) : [];

    return res.status(200).json({
      message: "User verified successfully",
      user: {
        id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        roles,
      },
    });
  } catch (error) {
    console.error(error);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Access token expired" });
    }

    const roles = []; // Fallback for guest response
    return res.status(401).json({
      message: "Invalid access token",
      user: {
        id: "Guest",
        first_name: null,
        last_name: null,
        name: null,
        email: null,
        roles,
      },
    });
  }
};
