import express from "express";
import { connectToDataBase } from "../lib/db.js";
import jwt from "jsonwebtoken";

const bookingRouter = express.Router();

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
    const {
      carId,
      startDate,
      endDate,
      pickUpLocation,
      dropOffLocation,
      rideSharePrice,
      rideShareDestination,
      isRideShareEnabled,
    } = req.body;

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

    // Check if the user is trying to book their own car
    const [owner] = await db.query("SELECT userId FROM cars WHERE carId = ?", [
      carId,
    ]);
    if (owner.length === 0) {
      return res.status(404).json({ message: "Car not found" });
    }
    if (owner[0].userId === req.userId) {
      return res.status(403).json({ message: "You cannot book your own car" });
    }

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

    // Insert booking data into the database, including ride share details if enabled
    const [bookingResult] = await db.query(
      "INSERT INTO booking (userId, carId, startDate, endDate, pickUpLocation, dropOffLocation, totalAmount, rideSharePrice, rideShareDestination, isRideShareEnabled) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        req.userId,
        carId,
        startDate,
        endDate,
        pickUpLocation,
        dropOffLocation,
        totalAmount,
        isRideShareEnabled ? rideSharePrice : null, // Store price if ride-share is enabled
        isRideShareEnabled ? rideShareDestination : null, // Store destination if ride-share is enabled
        isRideShareEnabled ? 1 : 0, // Mark ride-share status
      ]
    );

    // Mark car as booked
    await db.query("UPDATE cars SET isBooked = 1 WHERE carId = ?", [carId]);

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
      "SELECT booking.*, cars.isBooked, cars.carName FROM booking JOIN cars ON cars.carId = booking.carId WHERE booking.userId = ?",
      [req.userId]
    );

    return res.status(200).json({ bookings });
  } catch (err) {
    console.error("Error in /my-bookings:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

bookingRouter.get("/lifts", async (req, res) => {
  try {
    const db = await connectToDataBase();

    const [rides] = await db.query(`
      SELECT 
        b.bookingId, 
        b.userId AS bookerId, 
        b.carId, 
        b.rideSharePrice, 
        b.rideShareDestination, 
        b.startDate, 
        b.endDate, 
        b.pickUpLocation, 
        b.dropOffLocation, 
        c.carName, 
        c.fuelType, 
        c.transmission 
      FROM booking b
      JOIN cars c ON b.carId = c.carId
      WHERE b.isRideShareEnabled = 1
    `);

    return res.status(200).json({ rides });
  } catch (err) {
    console.error("Error fetching lift rides:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

bookingRouter.get("/:bookingId", async (req, res) => {
  try {
    const { bookingId } = req.params; // Extract bookingId from URL
    const db = await connectToDataBase();

    // Query to fetch booking, car, and user details using JOIN
    const [result] = await db.query(
      `SELECT booking.*, cars.*, authentication.* 
       FROM booking
       JOIN cars ON booking.carId = cars.carId 
       JOIN authentication ON cars.userId = authentication.userId 
       WHERE booking.bookingId = ?`,
      [bookingId]
    );

    if (result.length === 0) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Merging booking, car, and user details
    const bookingDetails = {
      ...result[0], // Contains all the booking fields
      car: {
        // Adding car details under the 'car' object
        carId: result[0].carId,
        carName: result[0].carName,
        company: result[0].company,
        fuelType: result[0].fuelType,
        transmission: result[0].transmission,
        pricePerDay: result[0].pricePerDay,
        // Add other car fields here as needed
      },
      user: {
        // Adding user details under the 'user' object
        userId: result[0].userId,
        firstName: result[0].firstName,
        lastName: result[0].lastName,
        email: result[0].email,
        phone: result[0].phoneNumber,
        // Add other user fields here as needed
      },
    };

    return res.status(200).json({ booking: bookingDetails });
  } catch (err) {
    console.error("Error in /booking/:bookingId:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

export default bookingRouter;
