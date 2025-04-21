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
    const [[booking]] = await db.query(
      "SELECT userId, carId, isRideShareEnabled FROM booking WHERE bookingId = ?",
      [bookingId]
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Prevent requester from requesting their own ride
    if (booking.userId === req.userId) {
      return res
        .status(401)
        .json({ message: "You cannot request a lift for a booking you made." });
    }

    // Check for existing request
    const [existingRequest] = await db.query(
      "SELECT * FROM lift WHERE passengerId = ? AND bookingId = ?",
      [req.userId, bookingId]
    );

    if (existingRequest.length > 0) {
      return res.status(409).json({
        message: "You have already sent a lift request for this booking.",
      });
    }

    // Insert new lift request
    const [liftInsert] = await db.query(
      "INSERT INTO lift (passengerId, bookingId, isAccepted) VALUES (?, ?, 0)",
      [req.userId, bookingId]
    );

    const rideShareId = liftInsert.insertId;

    // Get requester's name
    const [[user]] = await db.query(
      "SELECT firstName, lastName FROM authentication WHERE userId = ?",
      [req.userId]
    );

    const passengerName = `${user.firstName} ${user.lastName}`;
    const sentAt = new Date().toISOString().slice(0, 19).replace("T", " ");

    // Send notification to the ride owner
    await db.query(
      "INSERT  INTO notification (bookingId, rideShareId, sentAt, message, userId) VALUES (?, ?, ?, ?, ?)",
      [
        null,
        rideShareId,
        sentAt,
        `${passengerName} has requested a ride in your car booking.`,
        booking.userId,
      ]
    );

    return res.status(201).json({ message: "Lift request sent successfully" });
  } catch (err) {
    console.error("Error in /request-lift:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

/////////////////////////////////////////////////////////////////////////////////////////////////

rideShareRouter.post("/respond", async (req, res) => {
  const db = await connectToDataBase();
  const { rideshareId, isAccepted } = req.body;

  try {
    if (isAccepted) {
      // Accept = Update lift and notify passenger
      await db.query(`UPDATE lift SET isAccepted = 1 WHERE rideshareId = ?`, [
        rideshareId,
      ]);

      // Fetch the passengerId
      const [[liftRow]] = await db.query(
        `SELECT passengerId FROM lift WHERE rideshareId = ?`,
        [rideshareId]
      );

      console.log(liftRow);

      const sentAt = new Date().toISOString().slice(0, 19).replace("T", " ");
      await db.query(
        `INSERT  INTO notification (rideshareId, userID, sentAt, message)
         VALUES (?, ?, ?, ?)`,
        [
          rideshareId,
          liftRow.passengerId, // Notifying the passenger
          sentAt,
          "Your rideshare request has been accepted.",
        ]
      );

      await db.query(
        `UPDATE notification SET isAccepted = 1 WHERE rideshareId = ?`,
        [rideshareId]
      );
    } else {
      // Reject = delete from lift and notify passenger
      const [[liftRow]] = await db.query(
        `SELECT passengerId FROM lift WHERE rideshareId = ?`,
        [rideshareId]
      );

      const sentAt = new Date().toISOString().slice(0, 19).replace("T", " ");
      await db.query(
        `INSERT  INTO notification (rideshareId, userID, sentAt, message)
         VALUES (?, ?, ?, ?)`,

        [
          rideshareId,
          liftRow.passengerId, // Notifying the passenger
          sentAt,
          "Your rideshare request was rejected.",
        ]
      );

      // Optionally delete the row or mark it as rejected
      await db.query(`DELETE FROM lift WHERE rideshareId = ?`, [rideshareId]);

      return res.json({ message: "Ride request rejected and user notified." });
    }
  } catch (err) {
    console.error("Error handling rideshare action:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

rideShareRouter.get("/:rideshareId", async (req, res) => {
  try {
    const { rideshareId } = req.params;
    const db = await connectToDataBase();

    // Join lift → booking → cars → authentication (as driver)
    const [result] = await db.query(
      `SELECT lift.*, 
              booking.carId, booking.rideShareDestination, booking.pickUpLocation, booking.dropOffLocation, 
              booking.startDate, booking.endDate, booking.rideSharePrice,
              cars.carName, cars.company, cars.transmission, cars.seatCapacity, cars.fuelType, cars.pricePerDay,
              
              -- Driver details
              driver.userId AS driverId, driver.firstName AS driverFirstName, driver.lastName AS driverLastName, 
              driver.email AS driverEmail, driver.phoneNumber AS driverPhone, driver.licenseNumber AS driverLicense,
    
              -- Passenger details
              passenger.userId AS passengerId, passenger.firstName AS passengerFirstName, passenger.lastName AS passengerLastName, 
              passenger.email AS passengerEmail, passenger.phoneNumber AS passengerPhone, passenger.licenseNumber AS passengerLicense
    
       FROM lift
       JOIN booking ON lift.bookingId = booking.bookingId
       JOIN cars ON booking.carId = cars.carId
       JOIN authentication AS driver ON booking.userId = driver.userId
       JOIN authentication AS passenger ON lift.passengerId = passenger.userId
       WHERE lift.rideshareId = ?`,
      [rideshareId]
    );

    if (result.length === 0) {
      return res.status(404).json({ error: "Ride-share not found" });
    }

    const rideShareDetails = {
      rideshareId: result[0].rideshareId,
      rideSharePrice: result[0].rideSharePrice,
      bookingId: result[0].bookingId,
      isAccepted: result[0].isAccepted,
      car: {
        carId: result[0].carId,
        carName: result[0].carName,
        company: result[0].company,
        transmission: result[0].transmission,
        seatCapacity: result[0].seatCapacity,
        fuelType: result[0].fuelType,
        pricePerDay: result[0].pricePerDay,
      },
      liftDetails: {
        pickUpLocation: result[0].pickUpLocation,
        dropOffLocation: result[0].dropOffLocation,
        destination: result[0].rideShareDestination,
        startDate: result[0].startDate,
        endDate: result[0].endDate,
      },
      driver: {
        userId: result[0].driverId,
        firstName: result[0].driverFirstName,
        lastName: result[0].driverLastName,
        email: result[0].driverEmail,
        phone: result[0].driverPhone,
        licenseNumber: result[0].driverLicense,
      },

      passenger: {
        userId: result[0].passengerId,
        firstName: result[0].passengerFirstName,
        lastName: result[0].passengerLastName,
        email: result[0].passengerEmail,
        phone: result[0].passengerPhone,
        licenseNumber: result[0].passengerLicense,
      },
    };

    return res.status(200).json({ rideShare: rideShareDetails });
  } catch (err) {
    console.error("Error in /rideshare/:rideshareId:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

export default rideShareRouter;
