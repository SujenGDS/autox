import express from "express";
import { connectToDataBase } from "../lib/db.js";
import jwt from "jsonwebtoken";

const rideShareRouter = express.Router();
