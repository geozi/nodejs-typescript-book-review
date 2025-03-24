/**
 * Person controller.
 * @module src/controllers/personController
 */
import { ServerError } from "errors/serverErrorClass";
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
import { NotFoundError } from "errors/notFoundErrorClass";
import { recastReqToIReq } from "mappers/common.mapper";
import { apiVersionNumbers } from "resources/codes/apiVersionNumbers";

/**
 * Handles HTTP requests for person info addition.
 *
 * @param {Request} req - An HTTP request.
 * @param {Response} res - An HTTP response.
 * @returns {Promise<void>} A promise that resolves to void.
 */
export const callPersonAddition = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const reqAsIRequest = recastReqToIReq(req);
    const newPerson = reqBodyToPerson(reqAsIRequest);
    const savedPerson = await addPerson(newPerson);

    res
      .setHeader("x-api-version", apiVersionNumbers.VERSION_1_0)
      .status(httpCodes.CREATED)
      .json({
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
        message: commonResponseMessages.BAD_REQUEST_MESSAGE,
        errors: error.message,
      });
      return;
    }
  }
};

/**
 * Handles HTTP requests for person info update.
 *
 * @param {Request} req - An HTTP request.
 * @param {Response} res - An HTTP response.
 * @returns {Promise<void>} A promise that resolves to void.
 */
export const callPersonUpdate = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const reqAsIRequest = recastReqToIReq(req);
    const personToUpdate = reqBodyToPersonUpdate(reqAsIRequest);
    const updatedPerson = await updatePerson(personToUpdate);

    res
      .setHeader("x-api-version", apiVersionNumbers.VERSION_1_0)
      .status(httpCodes.OK)
      .json({
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

/**
 * Handles HTTP requests for person info retrieval.
 *
 * @param {Request} req - An HTTP request.
 * @param {Response} res - An HTTP response.
 * @returns {Promise<void>} A promise that resolves to void.
 */
export const retrievePersonInfo = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const reqAsIRequest = recastReqToIReq(req);
    const username = reqAsIRequest.user.username;
    const retrievedPerson = await getPersonByUsername(username);

    res
      .setHeader("x-api-version", apiVersionNumbers.VERSION_1_0)
      .status(httpCodes.OK)
      .json({
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
