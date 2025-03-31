import express from "express";
import cors from "cors";
import router from "./routes/authRoutes.js";
import carRouter from "./routes/carRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import rideShareRouter from "./routes/rideShare.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/auth", router);
app.use("/car", carRouter);
app.use("/booking", bookingRouter);
app.use("/rideShare", rideShareRouter);

app.listen(process.env.PORT, () => {
  console.log("server is running");
});
