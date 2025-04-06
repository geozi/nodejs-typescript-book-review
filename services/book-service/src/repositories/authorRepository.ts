/**
 * Author repository.
 * @module src/repositories/authorRepository
 */
import { validate, ValidationError } from "class-validator";
import { AppDataSource } from "db/dataSource";
import { Author } from "entities/Author";
import { ServerError } from "errors/serverErrorClass";
import { IAuthorUpdate } from "interfaces/IAuthorUpdate";
import { appLogger } from "logs/loggerConfigs";
import { commonResponseMessages } from "messages/response/commonResponseMessages";

const authorRepository = AppDataSource.getRepository(Author);

/**
 * Returns the information of an author with the specified ID.
 *
 * @param {number} id - The ID of an author.
 * @returns {Promise<Author | null>} A promise that resolves to an {@link Author} object or null.
 * @throws - {@link ServerError}
 */
export const getAuthorById = async (id: number): Promise<Author | null> => {
  try {
    return await authorRepository.findOneBy({ id: id });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    appLogger.error(
      `Author repository: ${getAuthorById.name}: ServerError thrown`
    );

    throw new ServerError(commonResponseMessages.SERVER_ERROR_MESSAGE);
  }
};

/**
 * Adds the information of a new author to the database.
 *
 * @param {Author} newAuthor - An {@link Author} object containing the information of the new author.
 * @returns {Promise<Author>} A promise that resolves to an {@link Author} object.
 * @throws - {@link ServerError} | QueryFailedError | ValidationError
 */
export const addAuthor = async (newAuthor: Author): Promise<Author> => {
  try {
    const errors = await validate(newAuthor);
    if (errors.length > 0) {
      const constraintArray: (Record<string, string> | undefined)[] = [];
      errors.forEach((err) => constraintArray.push(err.constraints));
      const constraintObject = Object.assign({}, ...constraintArray);
      const validationError = new ValidationError();
      validationError.constraints = constraintObject;
      throw validationError;
    }

    return await authorRepository.save(newAuthor);
  } catch (error) {
    if (error instanceof ValidationError) {
      appLogger.error(
        `Author repository: ${addAuthor.name} -> ValidationError detected and re-thrown`
      );

      throw error;
    }

    appLogger.error(
      `Author repository: ${addAuthor.name} -> ServerError thrown`
    );

    throw new ServerError(commonResponseMessages.SERVER_ERROR_MESSAGE);
  }
};

/**
 * Updates the information of an author.
 *
 * @param {number} id - The ID of an author.
 * @param {IAuthorUpdate} updateObj - An {@link IAuthorUpdate} object containing the new information to be persisted.
 * @returns {Promise<Author | null>} A promise that resolves to an {@link Author} object or null.
 * @throws - {@link ServerError}
 */
export const updateAuthor = async (
  id: number,
  updateObj: IAuthorUpdate
): Promise<Author | null> => {
  try {
    const result = await authorRepository.update({ id: id }, updateObj);
    if (result.affected === 0) {
      return new Promise((resolve) => {
        resolve(null);
      });
    }

    return await authorRepository.findOneBy({ id: id });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    appLogger.error(
      `Author repository: ${updateAuthor.name} -> ServerError thrown`
    );

    throw new ServerError(commonResponseMessages.SERVER_ERROR_MESSAGE);
  }
};
