import cors from "cors";
import * as dotenv from "dotenv";
import express from "express";
import { catchJSONerror } from "middleware/catchers/jsonErrorCatcher";
import mongoose from "mongoose";
import passport from "passport";
import { redisClient } from "redis/redis.config";
import { authRouter } from "routes/authRoutes";
import { interServiceRouter } from "routes/interServiceRoutes";
import { personRouter } from "routes/personRoutes";
import { regRouter } from "routes/regRoutes";
import { userRouter } from "routes/userRoutes";
import "./routes/passportConfig";
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

app.use(cors());
app.use(express.json());
app.use(catchJSONerror);

// Open routes
app.use("/api/login", authRouter);
app.use("/api/register", regRouter);

// Inter-service routes
app.use("/api/inter-service", interServiceRouter);

//Protected routes

app.use(
  "/api/p/users",
  passport.authenticate("user-strategy", { session: false }),
  userRouter
);
app.use(
  "/api/p/persons",
  passport.authenticate("user-strategy", { session: false }),
  personRouter
);

app.listen(port, () => {
  console.log(`Server is listening on port: ${port}`);
});

connectToDb();
