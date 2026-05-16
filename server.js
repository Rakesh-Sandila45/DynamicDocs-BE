import express from "express";
import cors from "cors";
import { config } from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/user.js";

config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// app.use(cors({ origin: "http://localhost:3000" }));

// Connect to MongoDB
connectDB();

// Routes
app.use("/api", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
