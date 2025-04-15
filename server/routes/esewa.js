import express from "express";
import { connectToDataBase } from "../lib/db.js";

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

// Failure route
esewaRouter.get("/failure", (req, res) => {
  return res.status(400).json({ message: "Payment cancelled or failed" });
});

export default esewaRouter;
