/**
 * Authentication route.
 * @module src/routes/auth.route
 */
import { loginUser } from "auth/auth.controller";
import { userLoginRules } from "auth/auth.rules";
import { Router } from "express";
import { catchExpressValidationErrors } from "middleware/expressError.catch";

export const authRouter = Router();
authRouter.post(
  "/",
  ...userLoginRules(),
  catchExpressValidationErrors,
  loginUser
);
