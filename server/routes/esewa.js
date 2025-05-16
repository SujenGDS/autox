import express from "express";
import { connectToDataBase } from "../lib/db.js";
import jwt from "jsonwebtoken";

const esewaRouter = express.Router();

esewaRouter.get("/success", async (req, res) => {
  const { amt, pid, refId } = req.query;

  try {
    const response = await axios.post(
      "https://uat.esewa.com.np/epay/transrec",
      new URLSearchParams({
        amt,
        scd: "EPAYTEST",
        pid,
        rid: refId,
      }).toString(),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    const isSuccess = response.data.includes(
      "<response_code>Success</response_code>"
    );

    const db = await connectToDataBase();

    await db.query(
      "INSERT INTO payments (paymentId, carId, amount, refId, status) VALUES (?, ?, ?, ?,?)",
      [pid, amt, refId, isSuccess ? "Success" : "Failed"]
    );

    return res.status(200).json({
      message: isSuccess ? "Payment successful" : "Payment failed",
      success: isSuccess,
    });
  } catch (err) {
    console.error("Esewa payment verification failed:", err);
    return res
      .status(500)
      .json({ message: "Verification error", error: err.message });
  }
});

esewaRouter.post("/payment/success", async (req, res) => {
  try {
    // Get token from header and verify
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Verify and decode JWT token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const userId = decoded.userId;

    // Get payment data from request body
    const { transaction_code, total_amount, product_code, transaction_uuid } = req.body;

    if (!transaction_code || !total_amount || !product_code || !transaction_uuid) {
      return res.status(400).json({ message: 'Missing required payment data' });
    }

    // Connect to database
    const db = await connectToDataBase();

    // Insert into database using SQL query
    await db.query(
      "INSERT INTO payments (paymentId, carId, amount, refId, status, createdAt) VALUES (?, ?, ?, ?, ?, ?)",
      [
        transaction_uuid,
        1,
        total_amount,
        transaction_code,
        'completed',
        new Date()
      ]
    );

    res.status(200).json({ 
      message: 'Payment recorded successfully',
      paymentId: transaction_uuid
    });

  } catch (error) {
    console.error('Payment processing error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    res.status(500).json({ message: 'Error processing payment' });
  }
});

// Failure route
esewaRouter.get("/failure", (req, res) => {
  return res.status(400).json({ message: "Payment cancelled or failed" });
});

export default esewaRouter;
