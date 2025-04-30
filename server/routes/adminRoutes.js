import express from "express";
import { connectToDataBase } from "../lib/db.js";

const adminRouter = express.Router();

adminRouter.get("/all-users", async (req, res) => {
  try {
    const db = await connectToDataBase();
    const [users] = await db.query(`
      SELECT 
        userId, 
        firstName, 
        lastName, 
        email, 
        phoneNumber, 
        licenseNumber, 
        citizenshipFrontUrl,
        citizenshipBackUrl,
        licenseFrontUrl
      FROM authentication
    `);
    return res.status(200).json({ users });
  } catch (err) {
    console.error("Error in /admin/all-users:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

adminRouter.get("/all-listed-cars", async (req, res) => {
  try {
    const db = await connectToDataBase();
    const [cars] = await db.query(`
      SELECT 
        cars.carId,
        cars.carName,
        cars.company,
        cars.carPlateNumber,
        cars.blueBookUrl,
        cars.approvalStatus,              
        auth.firstName,
        auth.lastName,
        auth.email,
        auth.phoneNumber
      FROM cars
      JOIN authentication auth ON cars.userId = auth.userId
    `);
    return res.status(200).json({ cars });
  } catch (err) {
    console.error("Error in /admin/all-listed-cars:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// Admin route to get all bookings with car owner and renter info
adminRouter.get("/all-bookings", async (req, res) => {
  try {
    const db = await connectToDataBase();
    const [bookings] = await db.query(`
        SELECT 
          b.*, 
          c.carName, 
          c.company, 
          c.carPlateNumber, 
          renter.firstName AS renterFirstName, 
          renter.lastName AS renterLastName, 
          renter.email AS renterEmail, 
          owner.userId AS ownerId,
          owner.firstName AS ownerFirstName, 
          owner.lastName AS ownerLastName, 
          owner.email AS ownerEmail
        FROM booking b
        JOIN cars c ON b.carId = c.carId
        JOIN authentication renter ON b.userId = renter.userId
        JOIN authentication owner ON c.userId = owner.userId
        WHERE b.isCancelled = 0
      `);

    return res.status(200).json({ bookings });
  } catch (err) {
    console.error("Error in /admin/all-bookings:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// Admin route to get all rideshare bookings with passenger info
adminRouter.get("/all-rideshares", async (req, res) => {
  try {
    const db = await connectToDataBase();
    const [rideshares] = await db.query(`
        SELECT 
          l.*, 
          b.carId, 
          b.rideShareDestination, 
          b.startDate, 
          b.endDate, 
          p.firstName AS passengerFirstName, 
          p.lastName AS passengerLastName, 
          p.email AS passengerEmail
        FROM lift l
        JOIN booking b ON l.bookingId = b.bookingId
        JOIN authentication p ON l.passengerId = p.userId
      `);
    return res.status(200).json({ rideshares });
  } catch (err) {
    console.error("Error in /admin/all-rideshares:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// Admin route to get all cancelled bookings
adminRouter.get("/cancelled-bookings", async (req, res) => {
  try {
    const db = await connectToDataBase();
    const [cancelled] = await db.query(`
      SELECT 
        b.bookingId,
        b.carId,
        b.userId,
        b.startDate,
        b.endDate,
        b.cancelledAt, 
        c.carName, 
        c.company, 
        u.firstName AS userFirstName, 
        u.lastName AS userLastName, 
        u.email AS userEmail,
        u.phoneNumber AS userPhoneNumber
      FROM booking b
      JOIN cars c ON b.carId = c.carId
      JOIN authentication u ON b.userId = u.userId
      WHERE b.isCancelled = 1
    `);
    res.status(200).json({ cancelled });
  } catch (err) {
    console.error("Error in /admin/cancelled-bookings:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// Admin route to get active bookings
// Admin route to get active bookings with user details
adminRouter.get("/active-bookings", async (req, res) => {
  try {
    const db = await connectToDataBase();
    const [activeBookings] = await db.query(`
      SELECT 
        b.*, 
        c.isBooked,
        renter.firstName AS renterFirstName, 
        renter.lastName AS renterLastName, 
        renter.email AS renterEmail,
        renter.phoneNumber AS renterPhoneNumber
      FROM booking b
      JOIN cars c ON b.carId = c.carId
      JOIN authentication renter ON b.userId = renter.userId
      WHERE CURDATE() BETWEEN b.startDate AND b.endDate 
        AND b.isCancelled = 0
        AND c.isBooked = 1
    `);
    res.status(200).json({ activeBookings });
  } catch (err) {
    console.error("Error in /admin/active-bookings:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// GET: Get all pending cars
adminRouter.get("/pending-cars", async (req, res) => {
  try {
    const db = await connectToDataBase();
    const [pendingCars] = await db.query(
      "SELECT * FROM cars WHERE approvalStatus = 'pending'"
    );
    res.status(200).json({ pendingCars });
  } catch (err) {
    console.error("Error in /admin/pending-cars:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST: Accept a car
adminRouter.post("/accept-car/:carId", async (req, res) => {
  const { carId } = req.params;

  try {
    const db = await connectToDataBase();

    // Approve the car
    await db.query(
      "UPDATE cars SET approvalStatus = 'accepted' WHERE carId = ?",
      [carId]
    );

    // Get car owner's userId and name
    const [carRows] = await db.query(
      `SELECT c.userId, a.firstName, a.lastName
       FROM cars c
       JOIN authentication a ON c.userId = a.userId
       WHERE c.carId = ?`,
      [carId]
    );

    if (!carRows.length) {
      return res.status(404).json({ message: "Car not found" });
    }

    const { userId, firstName, lastName } = carRows[0];
    const sentAt = new Date();

    // Send notification
    await db.query(
      "INSERT INTO notification (bookingId, rideShareId, carId, sentAt, message, userId) VALUES (?, ?, ?, ?, ?, ?)",
      [
        null, // bookingId
        null, // rideShareId
        carId,
        sentAt,
        `Hi ${firstName}, your car listing has been approved `,
        userId,
      ]
    );

    res.status(200).send({ message: "Car accepted and notification sent" });
  } catch (err) {
    console.error("Error in /admin/accept-car:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST: Reject a car
adminRouter.post("/reject-car/:carId", async (req, res) => {
  const { carId } = req.params;
  try {
    const db = await connectToDataBase();
    await db.query(
      "UPDATE cars SET approvalStatus = 'rejected' WHERE carId = ?",
      [carId]
    );
    res.status(200).send({ message: "Car rejected successfully" });
  } catch (err) {
    console.error("Error in /admin/reject-car:", err);
    res.status(500).json({ message: "Server error" });
  }
});

adminRouter.delete("/delete/:carId", async (req, res) => {
  const { carId } = req.params;

  try {
    const db = await connectToDataBase();
    const [car] = await db.query("SELECT isBooked FROM cars WHERE carId = ?", [
      carId,
    ]);

    if (car.length === 0) {
      return res.status(404).json({ message: "Car not found" });
    }
    if (car[0].isBooked === 1) {
      return res
        .status(403)
        .json({ message: "Cannot delete a car that is currently booked" });
    }

    await db.query("DELETE FROM cars WHERE carId = ?", [carId]);

    res.status(200).json({ message: "Car deleted successfully" });
  } catch (error) {
    console.error("Error deleting car:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default adminRouter;
