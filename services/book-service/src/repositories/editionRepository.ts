/**
 * Edition repository.
 * @module src/repositories/editionRepository
 */
import { validate, ValidationError } from "class-validator";
import { AppDataSource } from "db/dataSource";
import { Book } from "entities/Book";
import { Edition } from "entities/Edition";
import { ServerError } from "errors/serverErrorClass";
import { IEditionUpdate } from "interfaces/IEditionUpdate";
import { appLogger } from "logs/loggerConfigs";
import { commonResponseMessages } from "messages/response/commonResponseMessages";
import { QueryFailedError } from "typeorm";

const editionRepository = AppDataSource.getRepository(Edition);

/**
 * Returns the information of a book edition with the specified ISBN.
 *
 * @param {string} isbn - The ISBN of a book edition.
 * @returns {Promise<Edition | null>} A promise that resolves to an {@link Edition} object or null.
 * @throws - {@link ServerError}
 */
export const getEditionByISBN = async (
  isbn: string
): Promise<Edition | null> => {
  try {
    return await editionRepository.findOneBy({ isbn: isbn });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    appLogger.error(
      `Edition repository: ${getEditionByISBN.name} -> ServerError thrown`
    );

    throw new ServerError(commonResponseMessages.SERVER_ERROR_MESSAGE);
  }
};

/**
 * Returns the information of book editions with the specified book ID.
 *
 * @param {Book} book - A {@link Book} object containing a book ID.
 * @returns {Promise<Edition[]>} A promise that resolves to an array of {@link Edition} objects.
 * @throws - {@link ServerError}
 */
export const getEditionsByBook = async (book: Book): Promise<Edition[]> => {
  try {
    return await editionRepository.findBy({ book: book });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    appLogger.error(
      `Edition repository: ${getEditionsByBook.name} -> ServerError thrown`
    );

    throw new ServerError(commonResponseMessages.SERVER_ERROR_MESSAGE);
  }
};

/**
 * Adds the information of a new edition to the database.
 *
 * @param {Edition} newEdition - An {@link Edition} object containing the information of a new book edition.
 * @returns {Promise<Edition>} A promise that resolves to an {@link Edition} object.
 * @throws - {@link ServerError} | QueryFailedError | ValidationError
 */
export const addEdition = async (newEdition: Edition): Promise<Edition> => {
  try {
    const errors = await validate(newEdition);
    if (errors.length > 0) {
      const constraintArray: (Record<string, string> | undefined)[] = [];
      errors.forEach((err) => constraintArray.push(err.constraints));
      const constraintObject = Object.assign({}, ...constraintArray);
      const validationError = new ValidationError();
      validationError.constraints = constraintObject;
      throw validationError;
    }

    return await editionRepository.save(newEdition);
  } catch (error) {
    if (error instanceof ValidationError) {
      appLogger.error(
        `Edition repository: ${addEdition.name} -> ValidationError detected and re-thrown`
      );

      throw error;
    }

    if (error instanceof QueryFailedError) {
      appLogger.error(
        `Edition repository: ${addEdition.name} -> ${error.name} detected and re-thrown`
      );

      throw error;
    }

    appLogger.error(
      `Edition repository: ${addEdition.name} -> ServerError thrown`
    );

    throw new ServerError(commonResponseMessages.SERVER_ERROR_MESSAGE);
  }
};

/**
 * Updates the information of a book edition.
 *
 * @param {number} id - The ID of a book edition.
 * @param {IEditionUpdate} updateObj - An {@link IEditionUpdate} object containing the new information to be persisted.
 * @returns {Promise<Edition | null>} A promise that resolves to an {@link Edition} object or null.
 * @throws - {@link ServerError}
 */
export const updateEdition = async (
  id: number,
  updateObj: IEditionUpdate
): Promise<Edition | null> => {
  try {
    const result = await editionRepository.update({ id: id }, updateObj);
    if (result.affected === 0) {
      return new Promise((resolve) => {
        resolve(null);
      });
    }

    return await editionRepository.findOneBy({ id: id });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    appLogger.error(
      `Edition repository: ${updateEdition.name} -> ServerError thrown`
    );

    throw new ServerError(commonResponseMessages.SERVER_ERROR_MESSAGE);
  }
};
