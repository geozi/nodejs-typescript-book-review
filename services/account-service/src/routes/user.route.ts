import { Router } from "express";
import { callUserUpdate, retrieveUser } from "controllers/user.controller";
import { userUpdateRules } from "middleware/user.rule";
import { catchExpressValidationErrors } from "middleware/expressError.catch";

export const userRouter = Router();
userRouter.get("/", retrieveUser);
userRouter.put(
  "/",
  ...userUpdateRules(),
  catchExpressValidationErrors,
  callUserUpdate
);
