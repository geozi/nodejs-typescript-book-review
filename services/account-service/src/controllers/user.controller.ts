import { ServerError } from "errors/serverError.class";
import { Request, Response } from "express";
import { appLogger } from "../../logs/logger.config";
import { reqBodyToUser } from "mappers/user.mapper";
import { userControllerResponseMessages } from "messages/response/userControllerResponse.message";
import { addUser } from "repositories/user.repository";
import { httpCodes } from "resources/codes/responseStatusCodes";
import { Error } from "mongoose";
import { commonResponseMessages } from "messages/response/commonResponse.message";

export async function callUserRegistration(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const newUser = await reqBodyToUser(req);
    const savedUser = await addUser(newUser);

    res.status(httpCodes.CREATED).json({
      message: userControllerResponseMessages.USER_REGISTERED,
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
        message: commonResponseMessages.BAD_REQUEST,
        errors: error.message,
      });
      return;
    }
  }
}
