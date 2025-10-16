// Server/models/Car.js
import connectDB from "../configs/db.js";

class Car {
  static async create({
    owner,
    brand,
    model,
    image,
    year,
    category,
    seating_capacity,
    fuel_type,
    transmission,
    pricePerDay,
    location,
    description,
    isAvailable = "yes",
  }) {
    try {
      const connection = await connectDB();

      const [rows] = await connection.execute(
        "SELECT COUNT(*) as count FROM cars"
      );
      const carId = `C${rows[0].count + 1}`;

      const query = `
        INSERT INTO cars 
        (id, owner, brand, model, image, year, category, seating_capacity, fuel_type, transmission, pricePerDay, location, description, isAvailable, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `;

      await connection.execute(query, [
        carId,
        owner,
        brand,
        model,
        image,
        year,
        category,
        seating_capacity,
        fuel_type,
        transmission,
        pricePerDay,
        location,
        description,
        isAvailable,
      ]);

      return {
        id: carId,
        owner,
        brand,
        model,
        image,
        year,
        category,
        seating_capacity,
        fuel_type,
        transmission,
        pricePerDay,
        location,
        description,
        isAvailable,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async findById(id) {
    try {
      const connection = await connectDB();
      const [rows] = await connection.execute(
        "SELECT * FROM cars WHERE id = ?",
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
      const [rows] = await connection.execute("SELECT * FROM cars");
      return rows;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

export default Car;

// Server/models/Car.js
// import mongoose, { model } from "mongoose";
// const { ObjectId } = mongoose.Schema.Types;

// const carSchema = new mongoose.Schema(
//   {
//     owner: { type: ObjectId, ref: "User" },
//     brand: { type: String, required: true },
//     model: { type: String, required: true },
//     image: { type: String, required: true },
//     year: { type: String, required: true },
//     category: { type: String, required: true },
//     seating_capacity: { type: String, required: true },
//     fuel_type: { type: String, required: true },
//     transmission: { type: String, required: true },
//     pricePerDay: { type: String, required: true },
//     location: { type: String, required: true },
//     description: { type: String, required: true },
//     isAvailable: { type: String, required: true },
//   },
//   { timestamps: true }
// );

// const Car = mongoose.model("Car", carSchema);

// export default Car;
