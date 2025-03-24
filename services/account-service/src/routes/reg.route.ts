/**
 * Registration route.
 * @module src/routes/reg.route
 */
import { callUserRegistration } from "controllers/userController";
import { Router } from "express";
import { catchExpressValidationErrors } from "middleware/catchers/expressErrorCatcher";
import { userRegistrationRules } from "middleware/rules/userRules";

export const regRouter = Router();
regRouter.post(
  "/",
  ...userRegistrationRules(),
  catchExpressValidationErrors,
  callUserRegistration
);
