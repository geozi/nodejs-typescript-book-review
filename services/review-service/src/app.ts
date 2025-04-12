import * as dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
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

app.listen(port, () => {
  console.log(`Server is listening on port: ${port}`);
});

connectToDb();
