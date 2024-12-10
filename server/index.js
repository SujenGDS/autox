import express from "express";
import cors from "cors";
import router from "./routes/authRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/auth", router);

app.listen(process.env.PORT, () => {
  console.log("server is running");
});
