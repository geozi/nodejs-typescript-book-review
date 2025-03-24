/**
 * User controller.
 * @module src/controllers/userController
 */
import { ServerError } from "errors/serverErrorClass";
import { Request, Response } from "express";
import { appLogger } from "../../logs/logger.config";
import { reqBodyToUser, reqBodyToUserUpdate } from "mappers/user.mapper";
import { userControllerResponseMessages } from "messages/response/userControllerResponse.message";
import { addUser, updateUser } from "repositories/user.repository";
import { httpCodes } from "resources/codes/responseStatusCodes";
import { Error } from "mongoose";
import { commonResponseMessages } from "messages/response/commonResponse.message";
import { NotFoundError } from "errors/notFoundErrorClass";
import { ErrorReply, AbortError } from "redis";
import { recastReqToIReq } from "mappers/common.mapper";
import { apiVersionNumbers } from "resources/codes/apiVersionNumbers";
import { redisClient } from "../../redis.config";

/**
 * Handles HTTP requests for user registration.
 *
 * @param {Request} req - An HTTP request.
 * @param {Response} res - An HTTP response.
 * @returns {Promise<void>} A promise that resolves to void.
 */
export async function callUserRegistration(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const newUser = await reqBodyToUser(req);
    const savedUser = await addUser(newUser);

    res
      .setHeader("x-api-version", apiVersionNumbers.VERSION_1_0)
      .status(httpCodes.CREATED)
      .json({
        message: userControllerResponseMessages.USER_REGISTERED_MESSAGE,
        data: savedUser,
      });
  } catch (error) {
    if (error instanceof ServerError) {
      appLogger.error(
        `User controller: ${callUserRegistration.name} -> ${error.name} detected and caught`
      );

      res.status(error.httpCode).json({ message: error.message });
      return;
    }

    if (error instanceof Error.ValidationError) {
      appLogger.error(
        `User controller: ${callUserRegistration.name} -> ${error.name} detected and caught`
      );

      res.status(httpCodes.BAD_REQUEST).json({
        message: commonResponseMessages.BAD_REQUEST_MESSAGE,
        errors: error.message,
      });
      return;
    }
  }
}

/**
 * Handles HTTP requests for user update.
 *
 * @param {Request} req - An HTTP request.
 * @param {Response} res - An HTTP response.
 * @returns {Promise<void>} A promise that resolves to void.
 */
export async function callUserUpdate(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const reqAsIRequest = recastReqToIReq(req);
    const userToUpdate = await reqBodyToUserUpdate(reqAsIRequest);
    const updatedUser = await updateUser(userToUpdate);

    await redisClient.hSet(updatedUser.username, {
      id: updatedUser.id,
      username: updatedUser.username,
      email: updatedUser.email,
      password: "<PROTECTED>",
      role: updatedUser.role,
    });

    res
      .setHeader("x-api-version", apiVersionNumbers.VERSION_1_0)
      .status(httpCodes.OK)
      .json({
        message: userControllerResponseMessages.USER_UPDATED_MESSAGE,
        data: updatedUser,
      });
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof ServerError) {
      appLogger.error(
        `User controller: ${callUserUpdate.name} -> ${error.name} detected and caught`
      );

      res.status(error.httpCode).json({ message: error.message });
      return;
    }

    if (error instanceof ErrorReply || error instanceof AbortError) {
      appLogger.error(
        `User controller: ${callUserUpdate.name} -> ${error.name} detected and caught`
      );

      res
        .status(httpCodes.INTERNAL_SERVER_ERROR)
        .json({ message: commonResponseMessages.REDIS_ERROR_MESSAGE });
      return;
    }
  }
}

/**
/**
 * Handles HTTP requests for user retrieval.
 *
 * @param {Request} req - An HTTP request.
 * @param {Response} res - An HTTP response.
 */
export function retrieveUser(req: Request, res: Response) {
  const reqAsIRequest = recastReqToIReq(req);
  const retrievedUser = reqAsIRequest.user;

  res
    .setHeader("x-api-version", apiVersionNumbers.VERSION_1_0)
    .status(httpCodes.OK)
    .json({
      message: userControllerResponseMessages.USER_RETRIEVED_MESSAGE,
      data: retrievedUser,
    });
}
