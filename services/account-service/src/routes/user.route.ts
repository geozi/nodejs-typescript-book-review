import { Router } from "express";
import {
  callUserRegistration,
  callUserUpdate,
  retrieveUser,
} from "controllers/user.controller";
import { userRegistrationRules, userUpdateRules } from "middleware/user.rule";
import { catchExpressValidationErrors } from "middleware/expressError.catch";

export const userRouter = Router();
userRouter.get("/", retrieveUser);
userRouter.post(
  "/",
  ...userRegistrationRules(),
  catchExpressValidationErrors,
  callUserRegistration
);
userRouter.put(
  "/",
  ...userUpdateRules(),
  catchExpressValidationErrors,
  callUserUpdate
);
