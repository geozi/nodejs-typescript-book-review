import { IPerson } from "interfaces/documents/iPerson.interface";
import { IPersonUpdate } from "interfaces/secondary/iPersonUpdate.interface";
import { appLogger } from "../../logs/logger.config";
import { Person } from "models/person.model";
import { Error } from "mongoose";
import { commonResponseMessages } from "messages/response/commonResponse.message";
import { ServerError } from "errors/serverError.class";
import { NotFoundError } from "errors/notFoundError.class";
import { personControllerResponseMessages } from "messages/response/personControllerResponse.message";

export const addPerson = async (newPerson: IPerson): Promise<IPerson> => {
  try {
    const savedPerson = await newPerson.save();

    appLogger.info(`Person repository: ${addPerson.name} called successfully`);

    return savedPerson;
  } catch (error) {
    if (error instanceof Error.ValidationError) {
      appLogger.error(
        `Person repository: ${addPerson.name} -> ${error.name} detected and re-thrown`
      );

      throw error;
    }

    appLogger.error(
      `Person repository: ${addPerson.name} -> ServerError thrown`
    );

    throw new ServerError(commonResponseMessages.SERVER_ERROR_MESSAGE);
  }
};

export const updatePerson = async (
  updateDataObject: IPersonUpdate
): Promise<IPerson> => {
  try {
    const { id, firstName, lastName, ssn, phoneNumber, address, username } = {
      ...updateDataObject,
    };

    const personToUpdate = {
      firstName: firstName,
      lastName: lastName,
      ssn: ssn,
      phoneNumber: phoneNumber,
      address: address,
      username: username,
    };

    const updatedPerson = await Person.findByIdAndUpdate(id, personToUpdate, {
      new: true,
      runValidators: true,
      context: "query",
    });

    if (updatedPerson === null) {
      throw new NotFoundError(
        personControllerResponseMessages.PERSON_INFO_NOT_FOUND_MESSAGE
      );
    }

    appLogger.info(
      `Person repository: ${updatePerson.name} called successfully`
    );

    return updatedPerson;
  } catch (error) {
    if (error instanceof NotFoundError) {
      appLogger.error(
        `Person repository: ${updatePerson.name} -> ${error.name} detected and re-thrown`
      );

      throw error;
    }

    appLogger.error(
      `Person repository: ${updatePerson.name} -> ServerError thrown`
    );

    throw new ServerError(commonResponseMessages.SERVER_ERROR_MESSAGE);
  }
};

export const getPersonByUsername = async (
  username: string
): Promise<IPerson> => {
  try {
    const foundPerson = await Person.findOne({ username: username });

    if (foundPerson === null) {
      throw new NotFoundError(
        personControllerResponseMessages.PERSON_INFO_NOT_FOUND_MESSAGE
      );
    }

    appLogger.info(
      `Person repository: ${getPersonByUsername.name} called successfully`
    );

    return foundPerson;
  } catch (error) {
    if (error instanceof NotFoundError) {
      appLogger.error(
        `Person repository: ${getPersonByUsername.name} -> ${error.name} detected and re-thrown`
      );

      throw error;
    }

    appLogger.error(
      `Person repository: ${getPersonByUsername.name} -> ServerError thrown`
    );

    throw new ServerError(commonResponseMessages.SERVER_ERROR_MESSAGE);
  }
};
