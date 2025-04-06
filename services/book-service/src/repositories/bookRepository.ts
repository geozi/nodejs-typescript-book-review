/**
 * Book repository.
 * @module src/repositories/bookRepository
 */
import { validate, ValidationError } from "class-validator";
import { AppDataSource } from "db/dataSource";
import { Book } from "entities/Book";
import { ServerError } from "errors/serverErrorClass";
import { IBookUpdate } from "interfaces/IBookUpdate";
import { appLogger } from "logs/loggerConfigs";
import { commonResponseMessages } from "messages/response/commonResponseMessages";
import { Genre } from "resources/enum/Genre";
import { QueryFailedError } from "typeorm";

const bookRepository = AppDataSource.getRepository(Book);

/**
 * Returns the information of books with the specified genre.
 *
 * @param {Genre} genre - A {@link Genre} assigned to books.
 * @returns {Promise<Book[]>} A promise that resolves to an array of {@link Book} objects.
 */
export const getBooksByGenre = async (genre: Genre): Promise<Book[]> => {
  try {
    return await bookRepository.findBy({ genre: genre });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    appLogger.error(
      `Book repository: ${getBooksByGenre.name} -> ServerError thrown`
    );

    throw new ServerError(commonResponseMessages.SERVER_ERROR_MESSAGE);
  }
};

/**
 * Returns the information of a book with the specified title.
 *
 * @param {string} title - The title of a book.
 * @returns {Promise<Book | null>} A promise that resolves to a {@link Book} object or null.
 */
export const getBookByTitle = async (title: string): Promise<Book | null> => {
  try {
    return await bookRepository.findOneBy({ title: title });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    appLogger.error(
      `Book repository: ${getBookByTitle.name} -> ServerError thrown`
    );

    throw new ServerError(commonResponseMessages.SERVER_ERROR_MESSAGE);
  }
};

/**
 * Returns the information of a book with the specified ID.
 *
 * @param {number} id - The ID of a book.
 * @returns {Promise<Book | null>} A promise that resolves to a {@link Book} object or null.
 */
export const getBookById = async (id: number): Promise<Book | null> => {
  try {
    return await bookRepository.findOneBy({ id: id });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    appLogger.error(
      `Book repository: ${getBookById.name} -> ServerError thrown`
    );

    throw new ServerError(commonResponseMessages.SERVER_ERROR_MESSAGE);
  }
};

/**
 * Adds the information of a new book to the database.
 *
 * @param {Book} newBook - A {@link Book} object containing the information of the new book.
 * @returns {Promise<Book>} A promise that resolves to a {@link Book} object.
 * @throws - {@link ServerError} | QueryFailedError | ValidationError
 */
export const addBook = async (newBook: Book): Promise<Book> => {
  try {
    const errors = await validate(newBook);
    if (errors.length > 0) {
      const constraintArray: (Record<string, string> | undefined)[] = [];
      errors.forEach((err) => constraintArray.push(err.constraints));
      const constraintObject = Object.assign({}, ...constraintArray);
      const validationError = new ValidationError();
      validationError.constraints = constraintObject;
      throw validationError;
    }

    return await bookRepository.save(newBook);
  } catch (error) {
    if (error instanceof ValidationError) {
      appLogger.error(
        `Book repository: ${addBook.name} ->ValidationError detected and re-thrown`
      );

      throw error;
    }

    if (error instanceof QueryFailedError) {
      appLogger.error(
        `Book repository: ${addBook.name} -> ${error.name} detected and re-thrown`
      );

      throw error;
    }

    appLogger.error(`Book repository: ${addBook.name} -> ServerError thrown`);

    throw new ServerError(commonResponseMessages.SERVER_ERROR_MESSAGE);
  }
};

/**
 * Updates the information of a book.
 *
 * @param {number} id - The ID of a book.
 * @param {IBookUpdate} updateObj - An {@link IBookUpdate} object containing the new information to be persisted.
 * @returns {Promise<Book | null>} A promise that resolves to a {@link Book} object or null.
 */
export const updateBook = async (
  id: number,
  updateObj: IBookUpdate
): Promise<Book | null> => {
  try {
    const result = await bookRepository.update({ id: id }, updateObj);
    if (result.affected === 0) {
      return new Promise((resolve) => {
        resolve(null);
      });
    }

    return await bookRepository.findOneBy({ id: id });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    appLogger.error(
      `Book repository: ${updateBook.name} -> ServerError thrown`
    );

    throw new ServerError(commonResponseMessages.SERVER_ERROR_MESSAGE);
  }
};

/**
 * Returns the full information of a {@link Book} entity, including its
 * authors and editions.
 *
 * @param {number} id - The ID of a book.
 * @returns {Promise<Book | null>} A promise that resolves to a {@link Book} object or null.
 * @throws - {@link ServerError}
 */
export const getFullInfoBookById = async (id: number) => {
  try {
    const book = await bookRepository.findOne({
      where: { id: id },
      relations: ["authors", "editions"],
    });

    return book;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    appLogger.error(
      `Book repository: ${getFullInfoBookById.name} -> ServerError thrown`
    );

    throw new ServerError(commonResponseMessages.SERVER_ERROR_MESSAGE);
  }
};
