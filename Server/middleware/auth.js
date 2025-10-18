import jwt from "jsonwebtoken";
import connectDB from "../configs/db.js";

export const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Not Authorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || !decoded.id) {
      return res
        .status(401)
        .json({ success: false, message: "Not Authorized" });
    }

    const connection = await connectDB();
    const [rows] = await connection.execute(
      "SELECT * FROM users WHERE id = ?",
      [decoded.id]
    );
    const user = rows[0];

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    delete user.password;

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};
