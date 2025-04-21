import express, { request } from "express";
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

////////////////////////////////////////////////////////
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

    const [owner] = await db.query("SELECT userId FROM cars WHERE carId = ?", [
      carId,
    ]);
    if (owner.length === 0) {
      return res.status(404).json({ message: "Car not found" });
    }
    if (owner[0].userId === req.userId) {
      return res.status(403).json({ message: "You cannot book your own car" });
    }

    const [existingBookings] = await db.query(
      "SELECT * FROM booking WHERE carId = ? AND ((startDate BETWEEN ? AND ?) OR (endDate BETWEEN ? AND ?)) AND isCancelled = 0",
      [carId, startDate, endDate, startDate, endDate]
    );
    if (existingBookings.length > 0) {
      return res
        .status(409)
        .json({ message: "Car is unavailable for the selected dates" });
    }

    const [car] = await db.query(
      "SELECT pricePerDay FROM cars WHERE carId = ?",
      [carId]
    );
    if (car.length === 0) {
      return res.status(404).json({ message: "Car not found" });
    }

    const pricePerDay = car[0].pricePerDay;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const rentalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const totalAmount = rentalDays * pricePerDay;

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
        isRideShareEnabled ? rideSharePrice : null,
        isRideShareEnabled ? rideShareDestination : null,
        isRideShareEnabled ? 1 : 0,
      ]
    );

    const bookingId = bookingResult.insertId;

    const [[carOwnerId]] = await db.query(
      "SELECT userId FROM cars WHERE carId = ?",
      [carId]
    );

    const [userRows] = await db.query(
      "SELECT firstName, lastName FROM authentication WHERE userId = ?",
      [req.userId]
    );
    const { firstName, lastName } = userRows[0] || {};

    const sentAt = new Date().toISOString().slice(0, 19).replace("T", " ");

    await db.query(
      "INSERT  INTO notification (bookingId, rideShareId, carId, sentAt, message, userId) VALUES (?,?,?,?,?,?)",
      [
        bookingId,
        null,
        carId,
        sentAt,
        `${firstName} ${lastName} has booked your car`,
        carOwnerId.userId,
      ]
    );

    await db.query("UPDATE cars SET isBooked = 1 WHERE carId = ?", [carId]);

    // ✅ Now finally, generate and return redirect URL
    const successUrl = "http://localhost:3000/payment-success";
    const failureUrl = "http://localhost:3000/payment/fail";
    const redirectUrl = `https://esewa.com.np/epay/main?amt=${totalAmount}&pdc=0&psc=0&txAmt=0&tAmt=${totalAmount}&pid=${bookingId}&scd=EPAYTEST&su=${successUrl}&fu=${failureUrl}`;

    return res.status(200).json({ redirectUrl });
  } catch (err) {
    console.error("Error in /book:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

//////////////////////////////////////////////////////////////////////////////

bookingRouter.get("/my-bookings", verifyToken, async (req, res) => {
  try {
    const db = await connectToDataBase();

    const [bookings] = await db.query(
      "SELECT booking.*, cars.isBooked, cars.images, cars.carName FROM booking JOIN cars ON cars.carId = booking.carId WHERE booking.userId = ? AND booking.isCancelled = 0 AND booking.isReturned = 0",
      [req.userId]
    );

    return res.status(200).json({ bookings });
  } catch (err) {
    console.error("Error in /my-bookings:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

//////////////////////////////////////////

bookingRouter.delete("/cancel/:bookingId", async (req, res) => {
  try {
    const db = await connectToDataBase();
    const bookingId = parseInt(req.params.bookingId);

    if (isNaN(bookingId)) {
      return res.status(400).json({ message: "Invalid booking ID" });
    }

    const [bookingRows] = await db.query(
      "SELECT carId, userId, isRideShareEnabled FROM booking WHERE bookingId = ? AND isCancelled = 0",
      [bookingId]
    );

    if (bookingRows.length === 0) {
      return res
        .status(404)
        .json({ message: "Booking not found or already cancelled" });
    }

    const { carId, userId, isRideShareEnabled } = bookingRows[0];

    // Cancel the booking
    await db.query("UPDATE booking SET isCancelled = 1 WHERE bookingId = ?", [
      bookingId,
    ]);

    // Free the car
    await db.query("UPDATE cars SET isBooked = 0 WHERE carId = ?", [carId]);

    // Delete from lift table
    await db.query("DELETE FROM lift WHERE bookingId = ?", [bookingId]);

    // Get user's name for notification
    const [[userRow]] = await db.query(
      "SELECT firstName, lastName FROM authentication WHERE userId = ?",
      [userId]
    );
    const { firstName, lastName } = userRow || {};

    // Get car owner's userId
    const [[carOwner]] = await db.query(
      "SELECT userId FROM cars WHERE carId = ?",
      [carId]
    );

    const sentAt = new Date().toISOString().slice(0, 19).replace("T", " ");
    const ownerMessage = `${firstName} ${lastName} cancelled the ride you shared.`;

    // Notify the car owner
    await db.query(
      "INSERT INTO notification (bookingId, rideShareId, sentAt, message, userId) VALUES (?, ?, ?, ?, ?)",
      [bookingId, null, sentAt, ownerMessage, carOwner.userId]
    );

    // --- Ride Share Handling ---
    if (isRideShareEnabled) {
      // Delete any existing ride share notifications
      await db.query(
        "DELETE FROM notification WHERE bookingId = ? AND rideShareId IS NOT NULL",
        [bookingId]
      );
    }

    res.status(200).json({ message: "Booking cancelled successfully" });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

//////////////////////////////////////////

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
      WHERE b.isRideShareEnabled = 1 AND c.isBooked = 1
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

bookingRouter.get("/my-booking/:carId", async (req, res) => {
  try {
    const { carId } = req.params;
    const db = await connectToDataBase();

    // Join booking with cars and renter (authentication linked with booking.userId)
    const [result] = await db.query(
      `SELECT booking.*, cars.*, renter.userId AS renterId, renter.firstName, renter.lastName, renter.email, renter.phoneNumber, renter.licenseNumber
       FROM booking
       JOIN cars ON booking.carId = cars.carId
       JOIN authentication AS renter ON booking.userId = renter.userId
       WHERE booking.carId = ?`,
      [carId]
    );

    if (result.length === 0) {
      return res.status(404).json({ error: "Booking not found" });
    }

    const bookingDetails = {
      ...result[0],
      car: {
        carId: result[0].carId,
        carName: result[0].carName,
        company: result[0].company,
        fuelType: result[0].fuelType,
        transmission: result[0].transmission,
        pricePerDay: result[0].pricePerDay,
      },
      renter: {
        userId: result[0].renterId,
        firstName: result[0].firstName,
        lastName: result[0].lastName,
        email: result[0].email,
        phone: result[0].phoneNumber,
      },
    };

    return res.status(200).json({ booking: bookingDetails });
  } catch (err) {
    console.error("Error in /my-booking/:bookingId:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

bookingRouter.put("/return/:carId", async (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  const decoded = jwt.verify(token, process.env.SECRET_KEY);
  const requesterId = decoded.id;
  try {
    const db = await connectToDataBase();
    const carId = parseInt(req.params.carId);

    if (isNaN(carId)) {
      return res.status(400).json({ message: "Invalid car ID" });
    }

    const [bookingRows] = await db.query(
      "SELECT bookingId, userId, endDate, isReturned FROM booking WHERE carId = ? AND isReturned = 0",
      [carId]
    );

    if (bookingRows.length === 0) {
      return res
        .status(404)
        .json({ message: "Booking not found or already returned" });
    }

    const { bookingId, userId, endDate, isReturned } = bookingRows[0];

    const currentDate = new Date();
    const bookingEndDate = new Date(endDate);

    if (currentDate < bookingEndDate) {
      return res.status(400).json({
        message: "Car cannot be returned until the booking end date has passed",
      });
    }
    // Mark the booking as returned
    await db.query("UPDATE booking SET isReturned = 1 WHERE bookingId = ?", [
      bookingId,
    ]);
    // Free the car by setting isBooked to 0
    await db.query("UPDATE cars SET isBooked = 0 WHERE carId = ?", [carId]);
    res.status(200).json({ message: "Car returned successfully" });
  } catch (error) {
    console.error("Error returning car:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

export default bookingRouter;
