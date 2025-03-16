import { ServerError } from "errors/serverError.class";
import { Response } from "express";
import { IRequest } from "interfaces/secondary/iRequest.interface";
import { appLogger } from "../../logs/logger.config";
import { reqBodyToPerson, reqBodyToPersonUpdate } from "mappers/person.mapper";
import { commonResponseMessages } from "messages/response/commonResponse.message";
import { personControllerResponseMessages } from "messages/response/personControllerResponse.message";
import { Error } from "mongoose";
import {
  addPerson,
  getPersonByUsername,
  updatePerson,
} from "repositories/person.repository";
import { httpCodes } from "resources/codes/responseStatusCodes";
import { NotFoundError } from "errors/notFoundError.class";

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

export const callPersonUpdate = async (req: IRequest, res: Response) => {
  try {
    const personToUpdate = reqBodyToPersonUpdate(req);
    const updatedPerson = await updatePerson(personToUpdate);

    res.status(httpCodes.OK).json({
      message: personControllerResponseMessages.PERSON_INFO_UPDATED_MESSAGE,
      data: updatedPerson,
    });
  } catch (error) {
    if (error instanceof ServerError || error instanceof NotFoundError) {
      appLogger.error(
        `Person controller: ${callPersonUpdate.name} -> ${error.name} detected and caught`
      );

      res.status(error.httpCode).json({ message: error.message });
      return;
    }
  }
};

export const retrievePersonInfo = async (req: IRequest, res: Response) => {
  try {
    const username = req.user.username;
    const retrievedPerson = await getPersonByUsername(username);

    res.status(httpCodes.OK).json({
      message: personControllerResponseMessages.PERSON_INFO_RETRIEVED_MESSAGE,
      data: retrievedPerson,
    });
  } catch (error) {
    if (error instanceof ServerError || error instanceof NotFoundError) {
      appLogger.error(
        `Person controller: ${retrievePersonInfo.name} -> ${error.name} detected and caught`
      );

      res.status(error.httpCode).json({ message: error.message });
      return;
    }
  }
};
