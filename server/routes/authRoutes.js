import express from "express";
import { connectToDataBase } from "../lib/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

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
      { id: rows[0].id, email: rows[0].email },
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

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers["authorization"].split(" ")[1];
    if (!token) {
      return res.status(403).json({ message: "No token provided" });
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    console.log(decoded);
    req.userId = decoded.id;
    req.email = decoded.email;
    next();
  } catch (err) {
    return res.status(500).json({ message: "server error" });
  }
};

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
export default router;
