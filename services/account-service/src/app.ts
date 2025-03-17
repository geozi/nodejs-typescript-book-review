import * as dotenv from "dotenv";
import mongoose from "mongoose";
import express from "express";
import { redisClient } from "../redis.config";
dotenv.config();
const app = express();
const port = 3000;

async function connectToDb() {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("Connection to database established");

    await redisClient.connect();
  } catch (error) {
    console.log("Failed to connect to database", error);
  }
}

app.listen(port, () => {
  console.log(`Server is listening on port: ${port}`);
});

connectToDb();
