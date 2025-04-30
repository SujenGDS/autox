import express from "express";
import cors from "cors";
import router from "./routes/authRoutes.js";
import carRouter from "./routes/carRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import rideShareRouter from "./routes/rideShare.js";
import esewaRouter from "./routes/esewa.js";
import adminRouter from "./routes/adminRoutes.js";

const app = express();

app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});

app.use(cors());
app.use(express.json());
app.use("/auth", router);
app.use("/car", carRouter);
app.use("/booking", bookingRouter);
app.use("/rideShare", rideShareRouter);
app.use("/esewa", esewaRouter);
app.use("/admin", adminRouter);

app.listen(process.env.PORT, () => {
  console.log("server is running");
});
