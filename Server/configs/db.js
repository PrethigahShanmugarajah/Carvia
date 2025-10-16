// Server/configs/db.js
import mysql from "mysql2/promise";

const connectDB = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,
    });

    console.log("MySQL Connected!");
    return connection;
  } catch (error) {
    console.error("MySQL Connection Error:", error.message);
  }
};

export default connectDB;

// Server/configs/db.js
// import mongoose from "mongoose";

// const connectDB = async () => {
//   try {
//     mongoose.connection.on("connected", () =>
//       console.log("MongoDB Connected!")
//     );
//     await mongoose.connect(`${process.env.MONGODB_URI}/car-rental`);
//   } catch (error) {
//     console.error("MongoDB Connection Error:", error.message);
//   }
// };

// export default connectDB;
