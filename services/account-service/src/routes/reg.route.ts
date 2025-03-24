/**
 * Registration route.
 * @module src/routes/reg.route
 */
import { callUserRegistration } from "controllers/userController";
import { Router } from "express";
import { catchExpressValidationErrors } from "middleware/expressError.catch";
import { userRegistrationRules } from "middleware/user.rule";

export const regRouter = Router();
regRouter.post(
  "/",
  ...userRegistrationRules(),
  catchExpressValidationErrors,
  callUserRegistration
);
