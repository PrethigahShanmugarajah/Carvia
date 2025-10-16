// Server/models/Booking.js
import connectDB from "../configs/db.js";

export const Booking = {
  async create(bookingData) {
    const connection = await connectDB();

    const [rows] = await connection.execute(
      "SELECT COUNT(*) AS total FROM bookings"
    );
    const nextId = rows[0].total + 1;
    const bookingId = `B${nextId}`;

    const query = `
      INSERT INTO bookings 
      (booking_id, car_id, user_id, owner_id, pickupDate, returnDate, status, price)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await connection.execute(query, [
      bookingId,
      bookingData.car,
      bookingData.user,
      bookingData.owner,
      bookingData.pickupDate,
      bookingData.returnDate,
      bookingData.status || "pending",
      bookingData.price,
    ]);

    return { bookingId, ...bookingData };
  },

  async findById(bookingId) {
    const connection = await connectDB();
    const [rows] = await connection.execute(
      "SELECT * FROM bookings WHERE booking_id = ?",
      [bookingId]
    );
    return rows[0] || null;
  },

  async findAllByUser(userId) {
    const connection = await connectDB();
    const [rows] = await connection.execute(
      "SELECT * FROM bookings WHERE user_id = ?",
      [userId]
    );
    return rows;
  },

  async findAllByOwner(ownerId) {
    const connection = await connectDB();
    const [rows] = await connection.execute(
      "SELECT * FROM bookings WHERE owner_id = ?",
      [ownerId]
    );
    return rows;
  },

  async updateStatus(bookingId, status) {
    const connection = await connectDB();
    await connection.execute(
      "UPDATE bookings SET status = ?, updated_at = NOW() WHERE booking_id = ?",
      [status, bookingId]
    );
    return await this.findById(bookingId);
  },
};

export default Booking;

// Server/models/Booking.js
// import mongoose from "mongoose";
// const { ObjectId } = mongoose.Schema.Types;

// const bookingSchema = new mongoose.Schema(
//   {
//     car: { type: ObjectId, ref: "Car", required: true },
//     user: { type: ObjectId, ref: "User", required: true },
//     owner: { type: ObjectId, ref: "User", required: true },
//     pickupDate: { type: Date, required: true },
//     returnDate: { type: Date, required: true },
//     status: {
//       type: String,
//       enum: ["pending", "confirmed", "cancelled"],
//       default: "pending",
//     },
//     price: { type: Number, required: true },
//   },
//   { timestamps: true }
// );

// const Booking = mongoose.model("Booking", bookingSchema);

// export default Booking;
