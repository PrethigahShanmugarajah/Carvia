import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import connectDB from "../configs/db.js";

/* JWT Token */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

/*  Email Validation */
const isEmailValid = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/*  Password Validation  */
const isPasswordLongEnough = (password) => password.length >= 8;

const hasRequiredChars = (password) =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])/.test(password);

/* ---------------- REGISTER USER ---------------- */
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "All Fields are Required" });
    }

    if (!isEmailValid(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Email Format" });
    }

    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Passwords do not match" });
    }

    if (!isPasswordLongEnough(password)) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    if (!hasRequiredChars(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must include uppercase, lowercase, number, and special character",
      });
    }

    const userExists = await User.findByEmail(email);
    if (userExists) {
      return res
        .status(400)
        .json({ success: false, message: "User Already Exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password: hashedPassword });

    const token = generateToken(user.id);

    return res.json({
      success: true,
      message: "User Registered Successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("Registration Error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/* ---------------- LOGIN USER ---------------- */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and Password are required" });
    }

    const user = await User.findByEmail(email);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid Credentials" });
    }

    const token = generateToken(user.id);

    return res.json({
      success: true,
      message: "User Logged in Successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("Login Error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/* ---------------- GET USER DATA USING TOKEN JWT [ID] ---------------- */
export const getUserData = async (req, res) => {
  try {
    const { user } = req;

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error("Get User Data Error:", error.message);

    return res.status(500).json({ success: false, message: error.message });
  }
};

/* ---------------- GET ALL CAR LIST ---------------- */
export const getCars = async (req, res) => {
  try {
    const connection = await connectDB();

    const [cars] = await connection.execute(
      "SELECT * FROM cars WHERE isAvailable = 'true' ORDER BY created_at DESC"
    );

    res.json({ success: true, cars });
  } catch (error) {
    console.error("Get Cars Error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};
