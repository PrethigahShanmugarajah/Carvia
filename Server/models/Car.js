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

      const query = `INSERT INTO cars (
        id, 
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
        created_at, 
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`;

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
