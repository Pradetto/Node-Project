import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

/* DATA IMPORT */
import Employees from "./models/Employees.js";
import { employeeData } from "./data/index.js";

/* ROUTES */
import authRoutes from "./routes/auth.js";
import dashboardRoutes from "./routes/dashboard.js";

const PORT = process.env.PORT || 8000;

/* CONFIGURATION */
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
mongoose.set("strictQuery", true);

/* ROUTES */
app.use(authRoutes);
app.use("/api", dashboardRoutes);

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    app.listen(PORT, () => console.log(`listening on PORT ${PORT || 8000}`));
    // ONLY INSERTED DATA ONE TIME
    // Employees.insertMany(employeeData);
  })
  .catch((err) => console.log("error"));
