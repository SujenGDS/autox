import express from "express";
import { connectToDataBase } from "../lib/db.js";
import jwt from "jsonwebtoken";

const bookingRouter = express.Router();

// Middleware to verify token
const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers["authorization"].split(" ")[1];
    if (!token) {
      return res.status(403).json({ message: "No token provided" });
    }

    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    if (!decodedToken) {
      return res.status(403).json({ message: "Invalid token" });
    }

    const { id, email } = decodedToken;
    req.userId = id;
    req.email = email;
    next();
  } catch (err) {
    console.error("Error in verifyToken:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// POST route for booking
bookingRouter.post("/book", verifyToken, async (req, res) => {
  try {
    const { carId, startDate, endDate, pickUpLocation, dropOffLocation } =
      req.body;
    if (
      !carId ||
      !startDate ||
      !endDate ||
      !pickUpLocation ||
      !dropOffLocation
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const db = await connectToDataBase();

    // Check if the car is already booked for the selected dates
    const [existingBookings] = await db.query(
      "SELECT * FROM booking WHERE carId = ? AND ((startDate BETWEEN ? AND ?) OR (endDate BETWEEN ? AND ?))",
      [carId, startDate, endDate, startDate, endDate]
    );

    if (existingBookings.length > 0) {
      return res
        .status(409)
        .json({ message: "Car is unavailable for the selected dates" });
    }

    // Get the price per day of the car
    const [car] = await db.query(
      "SELECT pricePerDay FROM cars WHERE carId = ?",
      [carId]
    );
    if (car.length === 0) {
      return res.status(404).json({ message: "Car not found" });
    }
    const pricePerDay = car[0].pricePerDay;

    // Calculate total amount
    const start = new Date(startDate);
    const end = new Date(endDate);
    const rentalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const totalAmount = rentalDays * pricePerDay;

    // Insert booking data into database
    await db.query(
      "INSERT INTO booking (userId, carId, startDate, endDate, pickUpLocation, dropOffLocation, totalAmount) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        req.userId,
        carId,
        startDate,
        endDate,
        pickUpLocation,
        dropOffLocation,
        totalAmount,
      ]
    );

    return res.status(201).json({ message: "Booking successful", totalAmount });
  } catch (err) {
    console.error("Error in /book:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

bookingRouter.get("/my-bookings", verifyToken, async (req, res) => {
  try {
    const db = await connectToDataBase();
    const [bookings] = await db.query(
      "SELECT * FROM booking WHERE userId = ?",
      [req.userId]
    );

    return res.status(200).json({ bookings });
  } catch (err) {
    console.error("Error in /my-bookings:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

export default bookingRouter;
