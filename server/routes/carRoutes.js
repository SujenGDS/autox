import express from "express";
import { connectToDataBase } from "../lib/db.js";

const carRouter = express.Router();

carRouter.post("/upload-car", async (req, res) => {
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

  try {
    const db = await connectToDataBase();

    // Insert car data into database
    await db.query(
      "INSERT INTO cars (carName, company, makeYear, seatCapacity, carPlateNumber, pricePerDay, mileage, currentKm, transmission, fuelType, featuresArray) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
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
