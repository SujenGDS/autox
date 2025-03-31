import express from "express";
import { connectToDataBase } from "../lib/db.js"; // Assuming this correctly handles DB connection
import jwt from "jsonwebtoken";

const rideShareRouter = express.Router();

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

// Ride share request route
rideShareRouter.post("/request-lift", verifyToken, async (req, res) => {
  try {
    const { bookingId } = req.body;

    if (!bookingId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const db = await connectToDataBase();

    // Check if the booking exists and ride-sharing is enabled
    const [booking] = await db.query(
      "SELECT userId, isRideShareEnabled FROM booking WHERE bookingId = ?",
      [bookingId]
    );

    if (booking.length === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check if the user making the request is the one who booked the car
    if (booking[0].userId === req.userId) {
      return res
        .status(401)
        .json({ message: "You cannot request a lift for a booking you made." });
    }

    const [existingRequest] = await db.query(
      "SELECT * FROM lift WHERE passengerId = ? AND bookingId = ?",
      [req.userId, bookingId]
    );

    if (existingRequest.length > 0) {
      return res
        .status(409)
        .json({
          message: "You have already sent a lift request for this booking.",
        });
    }

    // Insert lift request into the database with pending status (0)
    await db.query(
      "INSERT INTO lift (passengerId, bookingId, isAccepted) VALUES (?, ?, 0)",
      [req.userId, bookingId]
    );

    return res.status(201).json({ message: "Lift request sent successfully" });
  } catch (err) {
    console.error("Error in /request-lift:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

export default rideShareRouter;
