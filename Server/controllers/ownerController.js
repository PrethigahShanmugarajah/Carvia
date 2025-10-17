// Server/controllers/ownerController.js
import path, { format } from "path";
import connectDB from "../configs/db.js";
import fs from "fs";
import Car from "../models/Car.js";
import imagekit from "../configs/imageKit.js";
import Booking from "../models/Booking.js";
import { create } from "domain";

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
      )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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

    // const [rows] = await connection.execute(
    //   "SELECT * FROM cars WHERE car_id = ?",
    //   [carId]
    // );

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

    // const oldAvailability = car.isAvailable === 1;
    // const oldAvailability = car.isAvailable === "1";
    const oldAvailability = car.isAvailable === "true";

    // const newAvailability = !oldAvailability;
    // const newAvailability = oldAvailability ? "0" : "1";
    const newAvailability = oldAvailability ? "false" : "true";

    // await connection.execute(
    //   "UPDATE cars SET isAvailable = ?, updated_at = NOW() WHERE car_id = ?",
    //   [newAvailability ? 1 : 0, carId]
    // );

    // await connection.execute(
    //   "UPDATE cars SET isAvailable = ?, updated_at = NOW() WHERE id = ?",
    //   [newAvailability ? 1 : 0, carId]
    // );

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

    // await connection.execute("DELETE FROM cars WHERE id = ?", [carId]);

    res.json({
      success: true,
      message: "Car Removed",
      // previous: {
      //   owner: car.owner,
      //   isAvailable: car.isAvailable === 1,
      // },
      // current: {
      //   owner: null,
      //   isAvailable: false,
      // },
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

    // const monthlyRevenue = completedBookings.reduce(
    //   (acc, b) => acc + b.price,
    //   0
    // );

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

// Server/controllers/ownerController.js
// import User from "../models/User";

// /* ---------------- CHANGE ROLE OF USER TO OWNER ----------------*/
// export const changeRoleOwner = async (req, res) => {
//   try {
//     const { _id } = req.user;
//     await User.findByIdAndUpdate(_id, { role: "owner" });
//     res.json({ success: true, message: "Now you can list Cars" });
//   } catch (error) {
//     console.error("Registration Error:", error.message);
//     return res.status(500).json({ success: false, message: error.message });
//   }
//   y;
// };

/* ---------------- LIST CAR BY USER ---------------- */
// export const addCar = async (req, res) => {
//   const { _id } = req.user;
//   let car = JSON.parse(req.body.carData);
//   const imageFile = req.file;

//   /* Upload Image to ImageKit */
//   const fileBuffer = fs.readFileSync(imageFile.path);
//   const response = await imagekit.upload({
//     file: fileBuffer,
//     fileName: imageFile.originalName,
//     folder: "/cars",
//   });

//   /* Opyimization through imagekit URL transformation */
//   var optimizedImageUrl = imagekit.result({
//     path: response.filePath,
//     transformation: [
//       { height: "1280" } /* Width Resizing */,
//       { quality: "auto" } /* Auto Compression */,
//       { formatL: "webp" } /* Convert to Modern Format*/,
//     ],
//   });

//   const image = optimizedImageUrl;
//   await Car.create({ ...car, owner: _id, image });
//   res.json({ success: true, message: "Car Added" });

//   try {
//   } catch (error) {
//     console.error("eror in list vacar by user:", error.message);
//     return res.status(500).json({ success: false, message: error.message });
//   }
// };

/* ---------------- LIST OWNER'S CAR ---------------- */
// export const getOwnerCars = async (req, res) => {
//   try {
//     const { _id } = req.user;
//     const cars = await Car.findById({ owner: _id });
//     res.json({ success: true, cars });
//   } catch (error) {
//     console.error("Error in listing car by user:", error.message);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

/* ---------------- TOGGLE CAR AVAILABLITIY ---------------- */
// export const toggleCarAvailability = async (req, res) => {
//   try {
//     const { _id } = req.user;
//     const { carId } = req.body;
//     const car = await Car.findById(carId);

//     /* Checking is car belongs to the car */
//     if (car.owner.toString() !== _id.toString()) {
//       res.json({ success: true, message: "Unauthorized" });
//     }

//     car.isAvailable = !car.isAvailable;
//     await car.save();

//     res.json({ success: true, message: "Availability Toggled" });
//   } catch (error) {
//     console.error("Error in listing car by user:", error.message);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

/* ---------------- DELETE A CAR ---------------- */
// export const deleteCar = async (req, res) => {
//   try {
//     const { _id } = req.user;
//     const { carId } = req.body;
//     const car = await Car.findById(carId);

//     /* Checking is car belongs to the car */
//     if (car.owner.toString() !== _id.toString()) {
//       res.json({ success: true, message: "Unauthorized" });
//     }

//     car.owner = null;
//     car.isAvailable = false;

//     await car.save();

//     res.json({ success: true, message: "Car Removed" });
//   } catch (error) {
//     console.error("Error in listing car by user:", error.message);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

/* ---------------- GET OWNER DASHBOARD DATA ---------------- */
// export const getDashboardData = async (req, res) => {
//   try {
//     const { _id, role } = req.user;

//     if (role !== "owner") {
//       return res.json({ success: false, message: "Unauthorized" });
//     }
//     const cars = await Car.findById({ owner: _id });

//     const booking = Booking.findAllByOwner({ owner: _id })
//       .populate("car")
//       .sort({ createdAt: -1 });

//     const pendingBookings = await Booking.find({
//       owner: _id,
//       status: "pending",
//     });

//     const completedBookings = await Booking.find({
//       owner: _id,
//       status: "confirmed",
//     });

//     /* Calculate MonthlyRevenue from Bookings  Where status is Confirmed */
//     const monthlyRevenue = changeBookingStatus
//       .slice()
//       .filter((booking) => booking.status === "confirmed")
//       .reduce((acc, booking) => acc + booking.price, 0);

//     const dashboardData = {
//       totalCars: cars.length,
//       totalBookings: booking.length,
//       pendingBookings: pendingBookings.length,
//       completedBookings: completedBookings.length,
//       recentBookings: changeBookingStatus.slice(0, 3),
//       monthlyRevenue,
//     };

//     res.json({ success: true, dashboardData });
//   } catch (error) {
//     console.error("Error deleting car:", error.message);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

/* ---------------- UPDATE USER IMAGE ---------------- */
// export const updateUserImage = async (req, res) => {
//   try {
//     const { _id } = req.user;

//     const imageFile = req.file;

//     /* Upload Image to ImageKit */
//     const fileBuffer = fs.readFileSync(imageFile.path);

//     const response = await imagekit.upload({
//       file: fileBuffer,
//       fileName: imageFile.originalname,
//       folder: "/users",
//     });

//     /* Optimization through imageKit URL transformation */
//     var optimizedImageUrl = imagekit.url({
//       path: response.filePath,
//       transformation: [
//         { width: "400" } /*Width Resizing*/,
//         { quality: "auto" } /*Auto Compression*/,
//         { format: "webp" /*Convert to Modern Format*/ },
//       ],
//     });

//     const image = optimizedImageUrl;

//     await User.findByIdAndUpdate(_id, { image });

//     res.json({ success: true, message: "Image Updated" });
//   } catch (error) {
//     console.error("Error deleting car:", error.message);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };
