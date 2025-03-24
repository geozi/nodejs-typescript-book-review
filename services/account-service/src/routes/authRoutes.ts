/**
 * Authentication route.
 * @module src/routes/authRoutes
 */
import { loginUser } from "auth/authController";
import { userLoginRules } from "auth/authRules";
import { Router } from "express";
import { catchExpressValidationErrors } from "middleware/catchers/expressErrorCatcher";

export const authRouter = Router();
authRouter.post(
  "/",
  ...userLoginRules(),
  catchExpressValidationErrors,
  loginUser
);
