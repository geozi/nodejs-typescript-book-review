/**
 * Authentication route.
 * @module src/routes/auth.route
 */
import { loginUser } from "auth/auth.controller";
import { userLoginRules } from "auth/auth.rules";
import { Router } from "express";
import { catchExpressValidationErrors } from "middleware/expressError.catch";

export const authRouter = Router();

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: User login
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username of the user
 *               password:
 *                 type: string
 *                 description: The password of the user
 *     responses:
 *       400:
 *         description: Bad request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Bad request
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       message:
 *                         type: string
 *                         description: Error message
 *       200:
 *         description: Successful login.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Authentication success
 *                 token:
 *                   type: string
 *                   description: JSON Web Token
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Authentication failure
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Internal server error | Redis server error
 */
authRouter.post(
  "/",
  ...userLoginRules(),
  catchExpressValidationErrors,
  loginUser
);
