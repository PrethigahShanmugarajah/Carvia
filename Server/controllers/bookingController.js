import connectDB from "../configs/db.js";

/* ---------------- CHECK AVAILABILITY OF CAR FOR A GIVEN DATE ---------------- */
export const checkAvailability = async (carId, pickupDate, returnDate) => {
  const connection = await connectDB();

  const [bookings] = await connection.execute(
    `SELECT * FROM bookings 
      WHERE car_id = ?
        AND status != 'cancelled'
        AND pickupDate <= ? 
        AND returnDate >= ?`,
    [carId, returnDate, pickupDate]
  );

  return bookings.length === 0;
};

/* ---------------- CHECK AVAILABILITY OF CAR FOR A GIVEN DATE AND LOCATION ---------------- */
export const checkAvailabilityOfCar = async (req, res) => {
  try {
    const { location, pickupDate, returnDate } = req.body;

    const connection = await connectDB();

    const [cars] = await connection.execute(
      "SELECT * FROM cars WHERE location = ? AND isAvailable = 1",
      [location]
    );

    const availableCarsPromises = cars.map(async (car) => {
      const isAvailable = await checkAvailability(
        car.car_id,
        pickupDate,
        returnDate
      );
      return { ...car, isAvailable };
    });

    let availableCars = await Promise.all(availableCarsPromises);

    availableCars = availableCars.filter((car) => car.isAvailable === true);

    res.json({ success: true, availableCars });
  } catch (error) {
    console.error("Check Availability Error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/* ---------------- CREATING BOOKING ----------------*/
export const createBooking = async (req, res) => {
  try {
    const { id } = req.user;
    const { car, pickupDate, returnDate } = req.body;

    const isAvailable = await checkAvailability(car, pickupDate, returnDate);

    if (!isAvailable) {
      return res.json({ success: false, message: "Car is not available" });
    }

    const connection = await connectDB();

    const [carRows] = await connection.execute(
      "SELECT * FROM cars WHERE id = ?",
      [car]
    );

    if (carRows.length === 0) {
      return res.status(404).json({ success: false, message: "Car not found" });
    }

    const carData = carRows[0];

    const picked = new Date(pickupDate);
    const returned = new Date(returnDate);
    const noOfDays = Math.ceil((returned - picked) / (1000 * 60 * 60 * 24));
    const price = carData.pricePerDay * noOfDays;

    const [bookingCount] = await connection.execute(
      "SELECT COUNT(*) AS total FROM bookings"
    );
    const nextId = bookingCount[0].total + 1;
    const bookingId = `B${nextId}`;

    await connection.execute(
      `INSERT INTO bookings(
        booking_id, 
        car_id, 
        owner_id, 
        user_id, 
        pickupDate, 
        returnDate, 
        price
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [bookingId, car, carData.owner, id, pickupDate, returnDate, price]
    );

    res.json({
      success: true,
      message: "Booking Created",
      booking: {
        bookingId,
        car: carData.id,
        user: id,
        owner: carData.owner,
        pickupDate,
        returnDate,
        price,
      },
    });
  } catch (error) {
    console.error("Create Booking Error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/* ---------------- LIST USER BOOKINGS ----------------*/
export const getUserBookings = async (req, res) => {
  try {
    const { id } = req.user;
    const connection = await connectDB();

    const [bookings] = await connection.execute(
      `SELECT
        b.booking_id, 
        b.car_id, 
        b.owner_id, 
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
      WHERE b.user_id = ?
      ORDER BY b.created_at DESC`,
      [id]
    );

    res.json({ success: true, bookings });
  } catch (error) {
    console.error("Get User Bookings Error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/* ---------------- GET OWNER BOOKINGS ----------------*/
export const getOwnerBookings = async (req, res) => {
  try {
    const { id, role } = req.user;

    if (role !== "owner") {
      return res.json({ success: false, message: "Unauthorized" });
    }

    const connection = await connectDB();

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
        c.image AS car_image,
        u.name AS user_name, 
        u.email AS user_email, 
        u.role AS user_role, 
        u.image AS user_image
      FROM bookings b
      JOIN cars c ON b.car_id = c.id
      JOIN users u ON b.user_id = u.id
      WHERE b.owner_id = ?
      ORDER BY b.created_at DESC`,
      [id]
    );

    res.json({ success: true, bookings });
  } catch (error) {
    console.error("Get Owner Bookings Error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/* ---------------- CHANGE BOOKING STATUS ----------------*/
export const changeBookingStatus = async (req, res) => {
  try {
    const { id } = req.user;
    const { bookingId, status } = req.body;

    const connection = await connectDB();

    const [bookingRows] = await connection.execute(
      "SELECT * FROM bookings WHERE booking_id = ?",
      [bookingId]
    );

    if (bookingRows.length === 0) {
      return res.json({ success: false, message: "Booking not found" });
    }

    const booking = bookingRows[0];

    if (booking.owner_id !== id) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    await connection.execute(
      "UPDATE bookings SET status = ?, updated_at = NOW() WHERE booking_id = ?",
      [status, bookingId]
    );

    res.json({
      success: true,
      message: "Status Updated",
      changedFrom: booking.status,
      changedTo: status,
    });
  } catch (error) {
    console.error("Change Booking Status Error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};
