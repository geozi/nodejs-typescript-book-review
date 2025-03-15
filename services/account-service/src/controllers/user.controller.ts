import { ServerError } from "errors/serverError.class";
import { Request, Response } from "express";
import { appLogger } from "../../logs/logger.config";
import { reqBodyToUser, reqBodyToUserUpdate } from "mappers/user.mapper";
import { userControllerResponseMessages } from "messages/response/userControllerResponse.message";
import { addUser, updateUser } from "repositories/user.repository";
import { httpCodes } from "resources/codes/responseStatusCodes";
import { Error } from "mongoose";
import { commonResponseMessages } from "messages/response/commonResponse.message";
import { NotFoundError } from "errors/notFoundError.class";
import { IRequest } from "interfaces/secondary/iRequest.interface";

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

export async function callUserUpdate(req: Request, res: Response) {
  try {
    const userToUpdate = await reqBodyToUserUpdate(req as IRequest);
    const updatedUser = await updateUser(userToUpdate);

    res.status(httpCodes.OK).json({
      message: userControllerResponseMessages.USER_UPDATED,
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
  }
}

export async function retrieveUser(req: IRequest, res: Response) {
  const retrievedUser = req.user;

  res.status(httpCodes.OK).json({
    message: userControllerResponseMessages.USER_RETRIEVED,
    data: retrievedUser,
  });
}
