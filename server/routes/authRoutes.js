import express from "express";
import { connectToDataBase } from "../lib/db.js";
import bcrypt from "bcrypt";
import jwt, { decode } from "jsonwebtoken";

const router = express.Router();

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers["authorization"].split(" ")[1];
    if (!token) {
      return res.status(403).json({ message: "No token provided" });
    }
    const decodedToken = decodeToken(token);
    const id = decodedToken.id;
    const email = decodedToken.email;
    req.userId = id;
    req.email = email;
    next();
  } catch (err) {
    return res.status(500).json({ message: "server error" });
  }
};

export const decodeToken = (token) => {
  try {
    if (!token) {
      throw new Error("Token is required");
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    return decoded;
  } catch (err) {
    console.error("Error in getUserIdFromToken:", err.message);
    return null;
  }
};

// Registration
router.post("/register", async (req, res) => {
  // console.log(req);
  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    licenseNumber,
    password,
    citizenshipFrontUrl,
    citizenshipBackUrl,
    licenseFrontUrl,
  } = req.body;

  if (
    !firstName ||
    !lastName ||
    !email ||
    !phoneNumber ||
    !licenseNumber ||
    !password ||
    !citizenshipFrontUrl ||
    !citizenshipBackUrl ||
    !licenseFrontUrl
  ) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  try {
    const db = await connectToDataBase();

    const [rows] = await db.query(
      "SELECT * FROM authentication WHERE email = ?",
      [email]
    );
    if (rows.length > 0) {
      return res.status(409).json({ message: "User already exists" });
    }
    const hashPassword = await bcrypt.hash(password, 10);

    await db.query(
      "INSERT INTO authentication (firstName, lastName, email, phoneNumber, licenseNumber, password, citizenshipFrontUrl, citizenshipBackUrl, licenseFrontUrl) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        firstName,
        lastName,
        email,
        phoneNumber,
        licenseNumber,
        hashPassword,
        citizenshipFrontUrl,
        citizenshipBackUrl,
        licenseFrontUrl,
        ,
      ]
    );

    return res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error("Error in /register:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const db = await connectToDataBase();

    const [rows] = await db.query(
      "SELECT * FROM authentication WHERE email = ? AND isDeleted = 0",
      [email]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, rows[0].password);
    if (!isMatch) {
      return res.status(401).json({ message: "wrong password" });
    }

    const token = jwt.sign(
      { id: rows[0].userId, email: rows[0].email },
      process.env.SECRET_KEY,
      {
        expiresIn: "3h",
      }
    );

    return res.status(201).json({ token: token });
  } catch (err) {
    console.error("Error in /login:", err.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/home", verifyToken, async (req, res) => {
  console.log(req.userId);
  try {
    const db = await connectToDataBase();
    const [rows] = await db.query(
      "SELECT * FROM authentication WHERE email = ? AND isDeleted = 0",
      [req.email]
    );

    if (rows.length === 0) {
      return res.status(400).json({ message: "Bad Request" });
    }

    return res.status(201).json({ user: rows[0] });
  } catch (err) {
    return res.status(500).json({ message: "server error" });
  }
});

// car posted by the logged in user
router.get("/my-cars", verifyToken, async (req, res) => {
  try {
    const db = await connectToDataBase();
    const [cars] = await db.query(`
      SELECT c.* 
      FROM cars c
      JOIN authentication a ON c.userId = a.userId
      WHERE c.userId = ? AND a.isDeleted = 0
    `, [req.userId]);

    return res.status(200).json({ cars });
  } catch (err) {
    console.error("error in /my-cars:", err);
    return res.status(500).json({ error: "internal server error" });
  }
});

router.post("/logout", (req, res) => {
  try {
    res.status(200).json({ message: "Logged out succesfully" });
  } catch (err) {
    console.error("error in /logout", err);
    res.status(500).json({ error: "internal server error" });
  }
});

router.get("/my-booked-cars", verifyToken, async (req, res) => {
  try {
    const db = await connectToDataBase();
    const token = req.headers["authorization"]?.split(" ")[1];
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const userId = decoded.id;

    const [cars] = await db.query(
      `SELECT 
         b.bookingID,
         b.userId AS renterId,
         u.firstName AS renterFirstName,
         u.lastName AS renterLastName,
         c.carId,
         c.carName,
         c.pricePerDay,
         c.images,
         b.startDate,
         b.endDate
       FROM booking b
       JOIN cars c ON b.carId = c.carId
       JOIN authentication u ON b.userId = u.userId
       JOIN authentication owner ON c.userId = owner.userId
       WHERE c.userId = ? 
       AND c.isBooked = 1 
       AND b.isCancelled = 0
       AND u.isDeleted = 0
       AND owner.isDeleted = 0
       ORDER BY b.bookingID DESC`,
      [userId]
    );

    return res.status(200).json({ cars });
  } catch (err) {
    console.error("error in /my-booked-cars:", err);
    return res.status(500).json(err);
  }
});

router.get("/my-ride-share", verifyToken, async (req, res) => {
  try {
    const db = await connectToDataBase();
    const token = req.headers["authorization"]?.split(" ")[1];
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const userId = decoded.id;

    console.log("Fetching ride shares for userId:", userId);

    // First check if we have any records in the lift table
    const [liftRecords] = await db.query("SELECT * FROM lift");
    console.log("All lift records:", liftRecords);

    // Then check if we have any records for this user
    const [userLiftRecords] = await db.query(
      "SELECT * FROM lift WHERE passengerId = ?",
      [userId]
    );
    console.log("User's lift records:", userLiftRecords);

    // Check bookings table
    const [userBookings] = await db.query(
      "SELECT * FROM booking WHERE userId = ?",
      [userId]
    );
    console.log("User's bookings:", userBookings);

    // Modified query to be more lenient and include all necessary fields
    const [rideshare] = await db.query(
      `SELECT 
         l.rideshareId,
         l.passengerId,
         l.bookingId,
         l.isAccepted,
         b.userId AS driverId,
         driver.firstName AS driverFirstName,
         driver.lastName AS driverLastName,
         driver.phoneNumber AS driverPhoneNumber,
         passenger.firstName AS passengerFirstName,
         passenger.lastName AS passengerLastName,
         passenger.phoneNumber AS passengerPhoneNumber,
         b.startDate,
         b.endDate,
         b.rideShareDestination,
         b.rideSharePrice,
         c.carName,
         c.images
       FROM lift l
       LEFT JOIN booking b ON l.bookingId = b.bookingId
       LEFT JOIN authentication driver ON b.userId = driver.userId
       LEFT JOIN authentication passenger ON l.passengerId = passenger.userId
       LEFT JOIN cars c ON b.carId = c.carId
       WHERE (b.userId = ? OR l.passengerId = ?)
       ORDER BY l.rideshareId DESC`,
      [userId, userId]
    );

    console.log("Final rideshare query results:", rideshare);

    // Process the results
    const rideDetails = rideshare.map((ride) => ({
      ...ride,
      status: ride.isAccepted === 1 ? "Accepted" : "Pending"
    }));

    console.log("Processed rideDetails:", rideDetails);
    return res.status(200).json({ rideDetails });
  } catch (err) {
    console.error("Error in /my-ride-share:", err);
    return res.status(500).json({ error: "Internal server error", details: err.message });
  }
});

router.post("/cancel-notification/:notificationId", async (req, res) => {
  const { notificationId } = req.params;

  try {
    const db = await connectToDataBase();

    await db.query(
      "UPDATE notification SET isCancelled = 1 WHERE notificationId = ?",
      [notificationId]
    );

    res.status(200).json({ message: "Notification cancelled" });
  } catch (err) {
    console.error("Error cancelling notification:", err);
    res.status(500).json({ message: "Server error" });
  }
});

const checkForNewNotifications = async (userId) => {
  const db = await connectToDataBase();
  try {
    const [notifications] = await db.query(
      "SELECT * FROM notification WHERE userId = ? AND isCancelled = 0",
      [userId]
    );
    return notifications;
  } catch (err) {
    console.error("Error fetching notifications:", err);
    return [];
  }
};

// API Route
router.get("/notifications", async (req, res) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const userId = decoded.id;

    const newNotification = await checkForNewNotifications(userId);
    if (newNotification.length > 0) {
      res.json(newNotification);
    } else {
      res.json({ message: "No new notifications" });
    }
  } catch (error) {
    console.error("Error fetching notifications:", error); // Log the error for more insight
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
