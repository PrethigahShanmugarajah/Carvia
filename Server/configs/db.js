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
