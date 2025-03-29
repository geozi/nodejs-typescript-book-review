/**
 * Auth controller.
 * @module src/auth/authController
 */
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";
import { NotFoundError } from "errors/notFoundErrorClass";
import { ServerError } from "errors/serverErrorClass";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { appLogger } from "logs/loggerConfig";
import { commonResponseMessages } from "messages/response/commonResponseMessages";
import { AbortError, ErrorReply } from "redis";
import { redisClient } from "redis/redis.config";
import { getUserByUsername } from "repositories/userRepository";
import { apiVersionNumbers } from "resources/codes/apiVersionNumbers";
import { httpCodes } from "resources/codes/responseStatusCodes";
import { RoleType } from "resources/enums/roleTypeEnums";
import { authResponseMessages } from "./authResponseMessages";
dotenv.config();

/**
 * Handles HTTP requests for user login.
 *
 * @param {Request} req - An HTTP request.
 * @param {Response} res - An HTTP response.
 * @returns {Promise<void>} A promise that resolves to void.
 */
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;
    const user = await getUserByUsername(username);

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      res
        .status(httpCodes.UNAUTHORIZED)
        .json({ message: authResponseMessages.AUTHENTICATION_FAILED });
      return;
    }

    await redisClient.hSet(user.username, {
      id: user.id,
      username: user.username,
      email: user.email,
      password: "<PROTECTED>",
      role: user.role,
    });

    let token: string;
    if (user.role === RoleType.User) {
      token = jwt.sign(
        { loggedInUser: user.username },
        process.env.USER_KEY as string,
        { expiresIn: "1h" }
      );
    } else {
      token = jwt.sign(
        { loggedInUser: user.username },
        process.env.ADMIN_KEY as string,
        { expiresIn: "1h" }
      );
    }

    res
      .setHeader("x-api-version", apiVersionNumbers.VERSION_1_0)
      .status(httpCodes.OK)
      .json({
        message: authResponseMessages.AUTHENTICATION_SUCCESS,
        token: token,
      });
  } catch (error) {
    if (error instanceof NotFoundError) {
      appLogger.error(
        `Auth controller: ${loginUser.name} -> ${error.name} detected and caught`
      );

      res
        .status(httpCodes.UNAUTHORIZED)
        .json({ message: authResponseMessages.AUTHENTICATION_FAILED });
      return;
    }

    if (error instanceof ServerError) {
      appLogger.error(
        `Auth controller: ${loginUser.name} -> ${error.name} detected and caught`
      );

      res.status(error.httpCode).json({ message: error.message });
      return;
    }

    if (error instanceof ErrorReply || error instanceof AbortError) {
      appLogger.error(
        `Auth controller: ${loginUser.name} -> ${error.name} detected and caught`
      );

      res
        .status(httpCodes.INTERNAL_SERVER_ERROR)
        .json({ message: commonResponseMessages.REDIS_ERROR_MESSAGE });
      return;
    }
  }
};
