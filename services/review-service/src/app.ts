/**
 * Main.
 * @module src/app
 */
import cors from "cors";
import * as dotenv from "dotenv";
import express from "express";
import { catchJSONerror } from "middleware/catchers/jsonErrorCatcher";
import mongoose from "mongoose";
import { reviewRouter } from "routers/reviewRoutes";
dotenv.config();
const app = express();
const port = 3002;

async function connectToDb() {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("Connection to database established");
  } catch (error) {
    console.log("Failed to connect to database", error);
  }
}

app.use(cors());
app.use(express.json());
app.use(catchJSONerror);

// Protected routes
app.use("/api/p/reviews", reviewRouter);

app.listen(port, () => {
  console.log(`Server is listening on port: ${port}`);
});

connectToDb();
