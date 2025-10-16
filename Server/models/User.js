// Server/models/User.js
import connectDB from "../configs/db.js";

class User {
  static async create({ name, email, password, role = "user", image = "" }) {
    try {
      const connection = await connectDB();

      const [rows] = await connection.execute(
        "SELECT COUNT(*) AS count FROM users"
      );
      const userId = `U${rows[0].count + 1}`;

      const query = `
      INSERT INTO users (id, name, email, password, role, image, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;
      await connection.execute(query, [
        userId,
        name,
        email,
        password,
        role,
        image,
      ]);

      return { id: userId, name, email, role, image };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async findByEmail(email) {
    try {
      const connection = await connectDB();
      const [rows] = await connection.execute(
        "SELECT * FROM users WHERE email = ?",
        [email]
      );
      return rows[0];
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async findById(id) {
    try {
      const connection = await connectDB();
      const [rows] = await connection.execute(
        "SELECT * FROM users WHERE id = ?",
        [id]
      );
      return rows[0];
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async getAll() {
    try {
      const connection = await connectDB();
      const [rows] = await connection.execute("SELECT * FROM users");
      return rows;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

export default User;

// Server/models/User.js
// import mongoose from "mongoose";

// const userShema = new mongoose.Schema(
//   {
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     role: { type: String, enum: ["owner", "user"], default: "user" },
//     image: { type: String, default: "" },
//   },
//   { timestamps: true }
// );

// const User = mongoose.model("User", userShema);

// export default User;
