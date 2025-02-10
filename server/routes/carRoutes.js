import express from "express";
import { connectToDataBase } from "../lib/db.js";
import jwt from "jsonwebtoken";

const carRouter = express.Router();

carRouter.post("/upload-car", async (req, res) => {
  try {
    // Extract token from request headers
    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) {
      return res.status(403).json({ error: "No token provided" });
    }

    // Decode the token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    console.log("token", token);
    console.log(decoded, decoded.id);
    const userId = decoded.id;

    const {
      carName,
      company,
      makeYear,
      seatCapacity,
      carPlateNumber,
      pricePerDay,
      mileage,
      km,
      transmission,
      fuelType,
      featuresArray,
      terms,
    } = req.body;

    if (!terms) {
      return res
        .status(400)
        .json({ error: "You must accept the terms and conditions" });
    }

    const db = await connectToDataBase();

    // Insert car data into database
    await db.query(
      "INSERT INTO cars (carName, company, makeYear, seatCapacity, carPlateNumber, pricePerDay, mileage, currentKm, transmission, fuelType, featuresArray, userId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        carName,
        company,
        makeYear,
        seatCapacity,
        carPlateNumber,
        pricePerDay,
        mileage,
        km,
        transmission,
        fuelType,
        JSON.stringify(featuresArray),
        userId,
      ]
    );

    return res.status(201).json({ message: "Car uploaded successfully" });
  } catch (err) {
    console.error("Error in /upload-car:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Endpoint to fetch all cars
carRouter.get("/get-cars", async (req, res) => {
  try {
    const db = await connectToDataBase();

    // Fetch all cars from the database
    const [cars] = await db.query("SELECT * FROM cars");

    return res.status(200).json({ cars });
  } catch (err) {
    console.error("Error in /get-cars:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

export default carRouter;
