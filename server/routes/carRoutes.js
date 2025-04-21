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

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    console.log("token", token);
    console.log(decoded, decoded.id);
    const userId = decoded.id;

    const {
      carName,
      company,
      makeYear,
      type,
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

    await db.query(
      "INSERT INTO cars (carName, company, makeYear, type, seatCapacity, carPlateNumber, pricePerDay, mileage, currentKm, transmission, fuelType, featuresArray, userId) VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        carName,
        company,
        makeYear,
        type,
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

// fetch all cars
carRouter.get("/get-cars", async (req, res) => {
  try {
    const db = await connectToDataBase();
    if (!db) {
      console.error("Database connection failed");
      return res.status(500).json({ error: "Database connection failed" });
    }

    // Fetch all cars from the database
    // const [cars] = await db.query("SELECT * FROM cars");
    const [cars] = await db.query(
      "SELECT carId, carName, fuelType, transmission, pricePerDay, isBooked FROM cars WHERE isBooked = 0"
    );

    return res.status(200).json({ cars });
  } catch (err) {
    console.error("Error in /get-cars:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

carRouter.get("/:carId", async (req, res) => {
  try {
    const { carId } = req.params;
    const db = await connectToDataBase();

    // Fetch the car with the given carId
    const [cars] = await db.query("SELECT * FROM cars WHERE carId = ?", [
      carId,
    ]);

    if (cars.length === 0) {
      return res.status(404).json({ error: "Car not found" });
    }

    return res.status(200).json({ car: cars[0] });
  } catch (err) {
    console.error("Error in /car/:carId:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

carRouter.put("/edit-car/:id", async (req, res) => {
  try {
    const carId = req.params.id;
    const { carName, company, pricePerDay } = req.body;
    const db = await connectToDataBase();

    if (!carName || !company || !pricePerDay) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const query =
      "UPDATE cars SET carName = ?, company = ?, pricePerDay = ? WHERE carId = ?";
    const values = [carName, company, pricePerDay, carId];

    db.query(query, values, (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Database error", error: err });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Car not found" });
      }
    });

    return res.status(200).json({ message: "Car updated successfully" });
  } catch (error) {
    console.error("Server error:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

carRouter.delete("/delete-car/:id", async (req, res) => {
  try {
    const db = await connectToDataBase();
    const carId = parseInt(req.params.id);

    if (isNaN(carId)) {
      return res.status(400).json({ message: "Invalid car ID" });
    }

    const result = await db.query("DELETE FROM cars WHERE carId = ?", [carId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Car not found" });
    }

    res.status(200).json({ message: "Car deleted successfully" });
  } catch (error) {
    console.error("Error deleting car:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

carRouter.get("/booked-cars", async (req, res) => {
  try {
    const db = await connectToDataBase();

    // Fetch all booked cars
    const [cars] = await db.query("SELECT * FROM cars WHERE isBooked = 1");

    if (cars.length === 0) {
      return res.status(404).json({ message: "No booked cars found" });
    }

    return res.status(200).json({ cars });
  } catch (err) {
    console.error("Error in /car/booked-cars:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

carRouter.get("/get-cars/all", async (req, res) => {
  try {
    const db = await connectToDataBase();
    if (!db) {
      console.error("Database connection failed");
      return res.status(500).json({ error: "Database connection failed" });
    }

    // Fetch all cars from the database
    // const [cars] = await db.query("SELECT * FROM cars");
    const [cars] = await db.query(
      "SELECT carId, carName, company, makeYear, seatCapacity, mileage, currentKm, featuresArray, type, fuelType, transmission, pricePerDay, isBooked FROM cars where isBooked = 0"
    );

    return res.status(200).json({ cars });
  } catch (err) {
    console.error("Error in /get-cars/all:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

export default carRouter;
