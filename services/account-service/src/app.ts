import * as dotenv from "dotenv";
import mongoose from "mongoose";
import express from "express";
import { redisClient } from "../redis.config";
import { authRouter } from "routes/auth.route";
import { userRouter } from "routes/user.route";
import passport from "passport";
import "../src/routes/passport.config";
import { regRouter } from "routes/reg.route";
import { personRouter } from "routes/person.route";
import { catchJSONerror } from "middleware/jsonError.catch";
import swaggerUi from "swagger-ui-express";
import { swaggerOptions } from "../swagger.config";
import swaggerJSDoc from "swagger-jsdoc";
dotenv.config();
const app = express();
const port = 3000;
const swaggerDocs = swaggerJSDoc(swaggerOptions);

async function connectToDb() {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("Connection to database established");

    await redisClient.connect();
  } catch (error) {
    console.log("Failed to connect to database", error);
  }
}

app.use(express.json());
app.use(catchJSONerror);

// Open routes
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use("/api/login", authRouter);
app.use("/api/register", regRouter);

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
console.log(swaggerDocs);
