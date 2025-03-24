/**
 * Person repository.
 * @module src/repositories/person.repository
 */
import { IPerson } from "interfaces/documents/IPerson";
import { IPersonUpdate } from "interfaces/secondary/IPersonUpdate";
import { appLogger } from "../../logs/logger.config";
import { Person } from "models/Person";
import { Error } from "mongoose";
import { commonResponseMessages } from "messages/response/commonResponseMessages";
import { ServerError } from "errors/serverErrorClass";
import { NotFoundError } from "errors/notFoundErrorClass";
import { personControllerResponseMessages } from "messages/response/personControllerResponseMessages";

/**
 * Adds the personal information of a user to the database.
 *
 * @param {IPerson} newPerson - The new information to be persisted.
 * @returns {Promise<IPerson>} A promise that resolves to an {@link IPerson} object representing the newly saved document.
 */
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

/**
 * Updates the personal information of a user in the database.
 *
 * @param {IPersonUpdate} updateDataObject - The new information to be persisted.
 * @returns {Promise<IPerson>} A promise that resolves to an {@link IPerson} object representing the updated document.
 */
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

/**
 * Returns the personal information of a user with the specified username.
 *
 * @param {string} username - The username of the user.
 * @returns {Promise<IPerson>} A promise that resolves to an {@link IPerson} object.
 */
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
