import connectDB from "../configs/db.js";
import fs from "fs";
import imagekit from "../configs/imageKit.js";

/* ---------------- CHANGE ROLE OF USER TO OWNER ----------------*/
export const changeRoleOwner = async (req, res) => {
  try {
    const { id } = req.user;

    const connection = await connectDB();

    const query =
      "UPDATE users SET role = 'owner', updated_at = NOW() WHERE id = ?";
    const [result] = await connection.execute(query, [id]);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "Now you can list Cars" });
  } catch (error) {
    console.error("Change Role Error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/* ---------------- LIST CAR BY USER ---------------- */
export const addCar = async (req, res) => {
  try {
    const { id: ownerId } = req.user;
    const car = JSON.parse(req.body.carData);
    const imageFile = req.file;

    if (!imageFile) {
      return res
        .status(400)
        .json({ success: false, message: "Image file is required" });
    }

    const fileBuffer = fs.readFileSync(imageFile.path);

    const uploadResponse = await imagekit.upload({
      file: fileBuffer,
      fileName: imageFile.originalname,
      folder: "/cars",
    });

    const optimizedImageUrl = imagekit.url({
      src: uploadResponse.url,
      transformation: [
        { height: "1280" },
        { quality: "auto" },
        { format: "webp" },
      ],
    });

    const connection = await connectDB();

    const [rows] = await connection.execute(
      "SELECT COUNT(*) AS total FROM cars"
    );
    const nextId = rows[0].total + 1;
    const carId = `C${nextId}`;

    await connection.execute(
      `INSERT INTO cars (
        id, 
        owner, 
        brand, 
        model, 
        year, 
        category, 
        seating_capacity, 
        fuel_type, 
        transmission, 
        pricePerDay, 
        location, 
        description, 
        image, 
        isAvailable
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        carId,
        ownerId,
        car.brand,
        car.model,
        car.year,
        car.category,
        car.seating_capacity,
        car.fuel_type,
        car.transmission,
        car.pricePerDay,
        car.location,
        car.description,
        optimizedImageUrl,
        "true",
      ]
    );

    const [insertedCarRows] = await connection.execute(
      "SELECT * FROM cars WHERE id = ?",
      [carId]
    );

    fs.unlinkSync(imageFile.path);

    res.json({
      success: true,
      message: "Car Added Successfully",
      car: insertedCarRows[0],
    });
  } catch (error) {
    console.error("Error in listing car by user:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ---------------- LIST OWNER'S CAR ---------------- */
export const getOwnerCars = async (req, res) => {
  try {
    const { id } = req.user;

    const connection = await connectDB();

    const [cars] = await connection.execute(
      "SELECT * FROM cars WHERE owner = ?",
      [id]
    );

    res.json({ success: true, cars });
  } catch (error) {
    console.error("Error in listing owner's cars:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ---------------- TOGGLE CAR AVAILABILITY ---------------- */
export const toggleCarAvailability = async (req, res) => {
  try {
    const { id } = req.user;
    const { carId } = req.body;

    const connection = await connectDB();

    const [rows] = await connection.execute("SELECT * FROM cars WHERE id = ?", [
      carId,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Car not found" });
    }

    const car = rows[0];

    if (car.owner !== id) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    const oldAvailability = car.isAvailable === "true";

    const newAvailability = oldAvailability ? "false" : "true";

    await connection.execute(
      "UPDATE cars SET isAvailable = ?, updated_at = NOW() WHERE id = ?",
      [newAvailability, carId]
    );

    res.json({
      success: true,
      message: "Availability Toggled",
      previous: oldAvailability,
      current: newAvailability,
    });
  } catch (error) {
    console.error("Error toggling car availability:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ---------------- DELETE A CAR ---------------- */
export const deleteCar = async (req, res) => {
  try {
    const { id } = req.user;
    const { carId } = req.body;

    const connection = await connectDB();

    const [rows] = await connection.execute("SELECT * FROM cars WHERE id = ?", [
      carId,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Car not found" });
    }

    const car = rows[0];

    if (car.owner !== id) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    await connection.execute(
      "UPDATE cars SET owner = NULL, isAvailable = 0, updated_at = NOW() WHERE id = ?",
      [carId]
    );

    res.json({
      success: true,
      message: "Car Removed",
    });
  } catch (error) {
    console.error("Error deleting car:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ---------------- GET OWNER DASHBOARD DATA ---------------- */
export const getDashboardData = async (req, res) => {
  try {
    const { id, role } = req.user;

    if (role !== "owner") {
      return res.json({ success: false, message: "Unauthorized" });
    }

    const connection = await connectDB();

    const [cars] = await connection.execute(
      "SELECT * FROM cars WHERE owner = ?",
      [id]
    );

    const [bookings] = await connection.execute(
      `SELECT 
        b.booking_id, 
        b.car_id, 
        b.user_id, 
        b.pickupDate, 
        b.returnDate, 
        b.status, 
        b.price,
        c.brand, 
        c.model, 
        c.year, 
        c.category, 
        c.seating_capacity, 
        c.fuel_type, 
        c.transmission, 
        c.pricePerDay, 
        c.location, 
        c.description, 
        c.image
      FROM bookings b
      JOIN cars c ON b.car_id = c.id
      WHERE b.owner_id = ?
      ORDER BY b.created_at DESC`,
      [id]
    );

    const pendingBookings = bookings.filter((b) => b.status === "pending");
    const completedBookings = bookings.filter((b) => b.status === "confirmed");

    const monthlyRevenue = completedBookings.reduce(
      (acc, b) => acc + parseFloat(b.price),
      0
    );

    const dashboardData = {
      totalCars: cars.length,
      totalBookings: bookings.length,
      pendingBookings: pendingBookings.length,
      completedBookings: completedBookings.length,
      recentBookings: bookings.slice(0, 3),
      monthlyRevenue,
    };

    res.json({ success: true, dashboardData });
  } catch (error) {
    console.error("Get Dashboard Data Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ---------------- UPDATE USER IMAGE ---------------- */
export const updateUserImage = async (req, res) => {
  try {
    const { id } = req.user;
    const imageFile = req.file;

    if (!imageFile) {
      return res
        .status(400)
        .json({ success: false, message: "Image file is required" });
    }

    const fileBuffer = fs.readFileSync(imageFile.path);

    const response = await imagekit.upload({
      file: fileBuffer,
      fileName: imageFile.originalname,
      folder: "/users",
    });

    const optimizedImageUrl = imagekit.url({
      src: response.url,
      transformation: [
        { width: "400" },
        { quality: "auto" },
        { format: "webp" },
      ],
    });

    const connection = await connectDB();

    await connection.execute(
      "UPDATE users SET image = ?, updated_at = NOW() WHERE id = ?",
      [optimizedImageUrl, id]
    );

    fs.unlinkSync(imageFile.path);

    res.json({
      success: true,
      message: "Image Updated",
      image: optimizedImageUrl,
    });
  } catch (error) {
    console.error("Update User Image Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
