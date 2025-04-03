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

const checkForNewNotifications = async (userId) => {
  const db = await connectToDataBase();
  try {
    // Check for new bookings (Notify Car Owner) - Only for the current user
    const [bookings] = await db.query(
      `SELECT b.bookingID, b.userId AS renterId, c.userId AS ownerId, u.firstName, u.lastName
       FROM booking b 
       JOIN cars c ON b.carId = c.carId 
       JOIN authentication u ON b.userId = u.userId 
       LEFT JOIN notification n ON b.bookingID = n.bookingID 
       WHERE n.bookingID IS NULL AND c.userId = ?  -- Filter by car owner's userId
       ORDER BY b.bookingID DESC LIMIT 1`,
      [userId] // Pass userId as a parameter to the query
    );

    if (bookings.length > 0) {
      const { bookingID, ownerId, firstName, lastName } = bookings[0];
      const sentAt = new Date().toISOString().slice(0, 19).replace("T", " ");

      await db.query(
        `INSERT INTO notification (bookingID, userID, sentAt, message) VALUES (?, ?, ?, ?)`,
        [
          bookingID,
          ownerId, // Send to the car owner
          sentAt,
          `${firstName} ${lastName} has booked your car`,
        ]
      );

      console.log(`${firstName} ${lastName} has booked your car`);
      return {
        type: "booking",
        id: bookingID,
        userID: ownerId, // Send to the car owner
        message: `${firstName} ${lastName} has booked your car`,
      };
    }

    // Check for new rideshares (Notify the Driver) - Only for the current user
    const [rideshares] = await db.query(
      `SELECT l.rideshareId, l.passengerId, b.userId AS driverId, u.firstName, u.lastName
       FROM lift l 
       JOIN booking b ON l.bookingId = b.bookingID 
       JOIN authentication u ON l.passengerId = u.userId
       LEFT JOIN notification n ON l.rideshareId = n.rideshareId 
       WHERE n.rideshareId IS NULL AND b.userId = ?  -- Filter by driver userId
       ORDER BY l.rideshareId DESC LIMIT 1`,
      [userId] // Pass userId as a parameter to the query
    );

    if (rideshares.length > 0) {
      const { rideshareId, driverId, firstName, lastName } = rideshares[0];
      const sentAt = new Date().toISOString().slice(0, 19).replace("T", " ");

      await db.query(
        `INSERT INTO notification (rideshareId, userID, sentAt, message) VALUES (?, ?, ?, ?)`,
        [
          rideshareId,
          driverId, // Send to the driver
          sentAt,
          `${firstName} ${lastName} has joined your rideshare`,
        ]
      );

      console.log(`${firstName} ${lastName} has joined your rideshare`);
      return {
        type: "rideshare",
        id: rideshareId,
        userID: driverId, // Send to the driver
        message: `${firstName} ${lastName} has joined your rideshare`,
      };
    }

    return null;
  } catch (error) {
    console.error("Error checking for new notifications:", error);
    return null;
  }
};

// API Route
router.get("/notifications", async (req, res) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    console.log("token", token);
    console.log(decoded, decoded.id);
    const userId = decoded.id;
    const newNotification = await checkForNewNotifications(userId);
    if (newNotification) {
      res.json(newNotification);
    } else {
      res.json({ message: "No new notifications" });
    }
  } catch (error) {
    console.error("Error fetching notifications:", error); // Log the error for more insight
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Registration
router.post("/register", async (req, res) => {
  // console.log(req);
  const { firstName, lastName, email, phoneNumber, licenseNumber, password } =
    req.body;

  // Validate input
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phoneNumber ||
    !licenseNumber ||
    !password
  ) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const db = await connectToDataBase();

    //Check if a user with the provided email already exists
    const [rows] = await db.query(
      "SELECT * FROM authentication WHERE email = ?",
      [email]
    );

    // If a user already exists, return a error
    if (rows.length > 0) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Hash the password
    const hashPassword = await bcrypt.hash(password, 10);

    // Insert user data into database
    await db.query(
      "INSERT INTO authentication (firstName, lastName, email, phoneNumber, licenseNumber, password) VALUES (?, ?, ?, ?, ?, ?)",
      [firstName, lastName, email, phoneNumber, licenseNumber, hashPassword]
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
      "SELECT * FROM authentication WHERE email = ?",
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
    return res.status(500).json({ error: "Internal Server   Error" });
  }
});

router.get("/home", verifyToken, async (req, res) => {
  console.log(req.userId);
  try {
    const db = await connectToDataBase();
    const [rows] = await db.query(
      "SELECT * FROM authentication WHERE email = ?",
      [req.email]
    );

    if (rows.length === 0) {
      return res.status(400).json({ message: "Bad Request " });
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
    const [cars] = await db.query("SELECT * From cars WHERE userId = ?", [
      req.userId,
    ]);

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

export default router;
