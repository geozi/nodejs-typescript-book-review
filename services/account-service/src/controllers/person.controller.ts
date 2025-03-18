import { ServerError } from "errors/serverError.class";
import { Request, Response } from "express";
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
import { recastReqToIReq } from "mappers/common.mapper";

export const callPersonAddition = async (req: Request, res: Response) => {
  try {
    const reqAsIRequest = recastReqToIReq(req);
    const newPerson = reqBodyToPerson(reqAsIRequest);
    const savedPerson = await addPerson(newPerson);

    res
      .status(httpCodes.CREATED)
      .json({
        message: personControllerResponseMessages.PERSON_INFO_ADDED_MESSAGE,
        data: savedPerson,
      })
      .setHeader("x-api-version", "1.0");
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

export const callPersonUpdate = async (req: Request, res: Response) => {
  try {
    const reqAsIRequest = recastReqToIReq(req);
    const personToUpdate = reqBodyToPersonUpdate(reqAsIRequest);
    const updatedPerson = await updatePerson(personToUpdate);

    res
      .status(httpCodes.OK)
      .json({
        message: personControllerResponseMessages.PERSON_INFO_UPDATED_MESSAGE,
        data: updatedPerson,
      })
      .setHeader("x-api-version", "1.0");
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

export const retrievePersonInfo = async (req: Request, res: Response) => {
  try {
    const reqAsIRequest = recastReqToIReq(req);
    const username = reqAsIRequest.user.username;
    const retrievedPerson = await getPersonByUsername(username);

    res
      .status(httpCodes.OK)
      .json({
        message: personControllerResponseMessages.PERSON_INFO_RETRIEVED_MESSAGE,
        data: retrievedPerson,
      })
      .setHeader("x-api-version", "1.0");
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
