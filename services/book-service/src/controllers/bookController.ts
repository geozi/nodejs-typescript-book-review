/**
 * Book controller.
 * @module src/controllers/bookController
 */
import { ValidationError } from "class-validator";
import { NotFoundError } from "errors/notFoundErrorClass";
import { ServerError } from "errors/serverErrorClass";
import { Request, Response } from "express";
import { appLogger } from "logs/loggerConfigs";
import {
  reqBodyToBook,
  reqBodyToBookUpdate,
  reqBodyToGenre,
} from "mappers/bookMapper";
import { bookControllerResponseMessages } from "messages/response/bookControllerResponseMessages";
import {
  addBook,
  getBookById,
  getBookByTitle,
  getBooksByGenre,
  getFullInfoBookById,
  updateBook,
} from "repositories/bookRepository";
import { apiVersionNumbers } from "resources/codes/apiVersionNumbers";
import { httpCodes } from "resources/codes/responseStatusCodes";
import { QueryFailedError } from "typeorm";

/**
 * Handles HTTP requests for book addition.
 *
 * @param {Request} req - An HTTP request.
 * @param {Response} res - An HTTP response.
 * @returns {Promise<void>} A promise that resolves to void.
 */
export const callBookAddition = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const newBook = reqBodyToBook(req);
    const savedBook = await addBook(newBook);

    res
      .setHeader("x-api-version", apiVersionNumbers.VERSION_1_0)
      .status(httpCodes.CREATED)
      .json({
        message: bookControllerResponseMessages.BOOK_ADDED_MESSAGE,
        data: savedBook,
      });
  } catch (error) {
    if (error instanceof ValidationError) {
      appLogger.error(
        `Book controller: ${callBookAddition.name} -> ValidationError detected and caught`
      );

      res.status(httpCodes.BAD_REQUEST).json(error.constraints);
      return;
    }

    if (error instanceof QueryFailedError) {
      appLogger.error(
        `Book controller: ${callBookAddition.name} -> ${error.name} detected and caught`
      );

      res.status(httpCodes.BAD_REQUEST).json({ message: error.message });
      return;
    }

    if (error instanceof ServerError) {
      appLogger.error(
        `Book controller: ${callBookAddition.name} -> ${error.name} detected and caught`
      );

      res.status(error.httpCode).json({ message: error.message });
      return;
    }
  }
};

/**
 * Handles HTTP requests for book update.
 *
 * @param {Request} req - An HTTP request.
 * @param {Response} res - An HTTP response.
 * @returns {Promise<void>} A promise that resolves to void.
 * @throws - {@link NotFoundError}
 */
export const callBookUpdate = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const dataUpdateObject = reqBodyToBookUpdate(req);
    const id = dataUpdateObject.id;
    const bookToUpdate = dataUpdateObject.book;
    const updatedBook = await updateBook(id, bookToUpdate);

    if (updatedBook === null) {
      throw new NotFoundError(
        bookControllerResponseMessages.BOOK_NOT_FOUND_MESSAGE
      );
    }

    res
      .setHeader("x-api-version", apiVersionNumbers.VERSION_1_0)
      .status(httpCodes.OK)
      .json({
        message: bookControllerResponseMessages.BOOK_UPDATED_MESSAGE,
        data: updatedBook,
      });
  } catch (error) {
    if (error instanceof ServerError || error instanceof NotFoundError) {
      appLogger.error(
        `Book controller: ${callBookUpdate.name} -> ${error.name} detected and caught`
      );

      res.status(error.httpCode).json({ message: error.message });
      return;
    }
  }
};

/**
 * Handles HTTP requests for book retrieval by title.
 *
 * @param {Request} req - An HTTP request.
 * @param {Response} res - An HTTP response.
 * @returns {Promise<void>} A promise that resolves to void.
 * @throws - {@link NotFoundError}
 */
export const callBookRetrievalByTitle = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { title } = req.body;
    const retrievedBook = await getBookByTitle(title);

    if (retrievedBook === null) {
      throw new NotFoundError(
        bookControllerResponseMessages.BOOK_NOT_FOUND_MESSAGE
      );
    }

    res
      .setHeader("x-api-version", apiVersionNumbers.VERSION_1_0)
      .status(httpCodes.OK)
      .json({
        message: bookControllerResponseMessages.BOOK_RETRIEVED_MESSAGE,
        data: retrievedBook,
      });
  } catch (error) {
    if (error instanceof ServerError || error instanceof NotFoundError) {
      appLogger.error(
        `Book controller: ${callBookRetrievalByTitle.name} -> ${error.name} detected and caught`
      );

      res.status(error.httpCode).json({ message: error.message });
      return;
    }
  }
};

/**
 * Handles HTTP requests for book retrieval by ID.
 *
 * @param {Request} req - An HTTP request.
 * @param {Response} res - An HTTP response.
 * @returns {Promise<void>} A promise that resolves to void.
 * @throws - {@link NotFoundError}
 */
export const callBookRetrievalById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.body;
    const retrievedBook = await getBookById(id);

    if (retrievedBook === null) {
      throw new NotFoundError(
        bookControllerResponseMessages.BOOK_NOT_FOUND_MESSAGE
      );
    }

    res
      .setHeader("x-api-version", apiVersionNumbers.VERSION_1_0)
      .status(httpCodes.OK)
      .json({
        message: bookControllerResponseMessages.BOOK_RETRIEVED_MESSAGE,
        data: retrievedBook,
      });
  } catch (error) {
    if (error instanceof ServerError || error instanceof NotFoundError) {
      appLogger.error(
        `Book controller: ${callBookRetrievalById.name} -> ${error.name} detected and caught`
      );

      res.status(error.httpCode).json({ message: error.message });
      return;
    }
  }
};

/**
 * Handles HTTP requests for book retrieval by genre.
 *
 * @param {Request} req - An HTTP request.
 * @param {Response} res - An HTTP response.
 * @returns {Promise<void>} A promise that resolves to void.
 * @throws - {@link NotFoundError}
 */
export const callBookRetrievalByGenre = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const genre = reqBodyToGenre(req);
    const retrievedBooks = await getBooksByGenre(genre);
    if (retrievedBooks.length === 0) {
      throw new NotFoundError(
        bookControllerResponseMessages.BOOK_S_NOT_FOUND_MESSAGE
      );
    }

    res
      .setHeader("x-api-version", apiVersionNumbers.VERSION_1_0)
      .status(httpCodes.OK)
      .json({
        message: bookControllerResponseMessages.BOOK_S_RETRIEVED_MESSAGE,
        data: retrievedBooks,
      });
  } catch (error) {
    if (error instanceof ServerError || error instanceof NotFoundError) {
      appLogger.error(
        `Book controller: ${callBookRetrievalByGenre.name} -> ${error.name} detected and caught`
      );

      res.status(error.httpCode).json({ message: error.message });
      return;
    }
  }
};

/**
 * Handles HTTP requests for full info book retrieval.
 *
 * @param {Request} req - An HTTP request.
 * @param {Response} res - An HTTP response.
 * @returns {Promise<void>} A promise that resolves to void.
 * @throws - {@link NotFoundError}
 */
export const callFullInfoBookRetrieval = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.body;

    const retrievedFullInfoBook = await getFullInfoBookById(id);
    if (retrievedFullInfoBook === null) {
      throw new NotFoundError(
        bookControllerResponseMessages.BOOK_NOT_FOUND_MESSAGE
      );
    }

    res
      .setHeader("x-api-version", apiVersionNumbers.VERSION_1_0)
      .status(httpCodes.OK)
      .json({
        message: bookControllerResponseMessages.BOOK_RETRIEVED_MESSAGE,
        data: retrievedFullInfoBook,
      });
  } catch (error) {
    if (error instanceof ServerError || error instanceof NotFoundError) {
      appLogger.error(
        `Book controller: ${callFullInfoBookRetrieval.name} -> ${error.name} detected and caught`
      );

      res.status(error.httpCode).json({ message: error.message });
      return;
    }
  }
};
