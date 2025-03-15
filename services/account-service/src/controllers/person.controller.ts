import { ServerError } from "errors/serverError.class";
import { Response } from "express";
import { IRequest } from "interfaces/secondary/iRequest.interface";
import { appLogger } from "../../logs/logger.config";
import { reqBodyToPerson } from "mappers/person.mapper";
import { commonResponseMessages } from "messages/response/commonResponse.message";
import { personControllerResponseMessages } from "messages/response/personControllerResponse.message";
import { Error } from "mongoose";
import { addPerson } from "repositories/person.repository";
import { httpCodes } from "resources/codes/responseStatusCodes";

export const callPersonAddition = async (req: IRequest, res: Response) => {
  try {
    const newPerson = reqBodyToPerson(req);
    const savedPerson = await addPerson(newPerson);

    res.status(httpCodes.CREATED).json({
      message: personControllerResponseMessages.PERSON_INFO_ADDED_MESSAGE,
      data: savedPerson,
    });
  } catch (error) {
    if (error instanceof ServerError) {
      appLogger.error(
        `Person controller: ${callPersonAddition.name} -> ${error.name} detected and caught`
      );

      res.status(error.httpCode).json({ message: error.message });
      return;
    }

    if (error instanceof Error.ValidationError) {
      appLogger.error(
        `Person controller: ${callPersonAddition.name} -> ${error.name} detected and caught`
      );

      res.status(httpCodes.BAD_REQUEST).json({
        message: commonResponseMessages.BAD_REQUEST,
        errors: error.message,
      });
      return;
    }
  }
};
