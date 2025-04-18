import express from "express";
import { connectToDataBase } from "../lib/db.js";

const adminRouter = express.Router();

// Admin route to get all listed cars
adminRouter.get("/all-listed-cars", async (req, res) => {
  try {
    const db = await connectToDataBase();
    const [cars] = await db.query(`
        SELECT cars.carId, cars.carName, cars.company, cars.carPlateNumber, 
               auth.firstName, auth.lastName, auth.email, auth.phoneNumber
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
          b.*, 
          c.carName, 
          c.company, 
          u.firstName, 
          u.lastName, 
          u.email
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
adminRouter.get("/active-bookings", async (req, res) => {
  try {
    const db = await connectToDataBase();
    const [activeBookings] = await db.query(
      `SELECT b.*, c.isBooked 
         FROM booking b
         JOIN cars c ON b.carId = c.carId
         WHERE CURDATE() BETWEEN b.startDate AND b.endDate 
           AND b.isCancelled = 0
           AND c.isBooked = 1`
    );
    res.status(200).json({ activeBookings });
  } catch (err) {
    console.error("Error in /admin/active-bookings:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

export default adminRouter;
