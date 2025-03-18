import { Request, Response } from "express";
import { getUserByUsername } from "repositories/user.repository";
import bcrypt from "bcryptjs";
import { httpCodes } from "resources/codes/responseStatusCodes";
import { authResponseMessages } from "./authResponse.message";
import { RoleType } from "resources/enums/roleType.enum";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import { NotFoundError } from "errors/notFoundError.class";
import { appLogger } from "../../logs/logger.config";
import { ServerError } from "errors/serverError.class";
import { redisClient } from "../../redis.config";
import { AbortError, ErrorReply } from "redis";
import { commonResponseMessages } from "messages/response/commonResponse.message";
import { apiVersionNumbers } from "resources/codes/apiVersionNumbers";
dotenv.config();

export const loginUser = async (req: Request, res: Response) => {
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
        .json({ message: commonResponseMessages.REDIS_ERROR });
      return;
    }
  }
};
