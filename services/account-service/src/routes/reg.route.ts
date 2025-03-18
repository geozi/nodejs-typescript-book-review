import { callUserRegistration } from "controllers/user.controller";
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
