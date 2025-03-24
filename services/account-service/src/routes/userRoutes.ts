/**
 * User routes.
 * @module src/routes/userRoutes
 */
import { Router } from "express";
import { callUserUpdate, retrieveUser } from "controllers/userController";
import { userUpdateRules } from "middleware/rules/userRules";
import { catchExpressValidationErrors } from "middleware/catchers/expressErrorCatcher";

export const userRouter = Router();
userRouter.get("/", retrieveUser);
userRouter.put(
  "/",
  ...userUpdateRules(),
  catchExpressValidationErrors,
  callUserUpdate
);
