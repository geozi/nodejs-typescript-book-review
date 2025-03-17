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
      userId: user._id.toString(),
      added: new Date().toISOString(),
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

    res.status(httpCodes.OK).json({
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
  }
};
