/**
 * Edition controller.
 * @module src/controllers/editionController
 */
import { ValidationError } from "class-validator";
import { NotFoundError } from "errors/notFoundErrorClass";
import { ServerError } from "errors/serverErrorClass";
import { Request, Response } from "express";
import { appLogger } from "logs/loggerConfigs";
import {
  reqBodyToEdition,
  reqBodyToEditionUpdate,
} from "mappers/editionMapper";
import { bookControllerResponseMessages } from "messages/response/bookControllerResponseMessages";
import { editionControllerResponseMessages } from "messages/response/editionControllerResponseMessages";
import { getBookById } from "repositories/bookRepository";
import {
  addEdition,
  getEditionByISBN,
  getEditionsByBook,
  updateEdition,
} from "repositories/editionRepository";
import { apiVersionNumbers } from "resources/codes/apiVersionNumbers";
import { httpCodes } from "resources/codes/responseStatusCodes";

/**
 * Handles HTTP requests for edition addition.
 *
 * @param {Request} req - An HTTP request.
 * @param {Response} res - An HTTP response.
 * @returns {Promise<void>} A promise that resolves to void.
 */
export const callEditionAddition = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const newEdition = await reqBodyToEdition(req);
    const savedEdition = await addEdition(newEdition);

    res
      .setHeader("x-api-version", apiVersionNumbers.VERSION_1_0)
      .status(httpCodes.CREATED)
      .json({
        message: editionControllerResponseMessages.EDITION_ADDED,
        data: savedEdition,
      });
  } catch (error) {
    if (error instanceof ValidationError) {
      appLogger.error(
        `Edition controller: ${callEditionAddition.name} -> ValidationError detected and caught`
      );

      res.status(httpCodes.BAD_REQUEST).json(error.constraints);
      return;
    }

    if (error instanceof ServerError || error instanceof NotFoundError) {
      appLogger.error(
        `Edition controller: ${callEditionAddition.name} -> ${error.name} detected and caught`
      );

      res.status(error.httpCode).json({ message: error.message });
      return;
    }
  }
};

/**
 * Handles HTTP requests for edition update.
 *
 * @param {Request} req - An HTTP request.
 * @param {Response} res - An HTTP response.
 * @returns {Promise<void>} A promise that resolves to void.
 * @throws - {@link NotFoundError}
 */
export const callEditionUpdate = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const updateDataObject = await reqBodyToEditionUpdate(req);
    const id = updateDataObject.id;
    const editionToUpdate = updateDataObject.edition;
    const updatedEdition = await updateEdition(id, editionToUpdate);

    if (updatedEdition === null) {
      throw new NotFoundError(
        editionControllerResponseMessages.EDITION_NOT_FOUND
      );
    }

    res
      .setHeader("x-api-version", apiVersionNumbers.VERSION_1_0)
      .status(httpCodes.OK)
      .json({
        message: editionControllerResponseMessages.EDITION_UPDATED,
        data: updatedEdition,
      });
  } catch (error) {
    if (error instanceof ServerError || error instanceof NotFoundError) {
      appLogger.error(
        `Edition controller: ${callEditionUpdate.name} -> ${error.name} detected and caught`
      );

      res.status(error.httpCode).json({ message: error.message });
      return;
    }
  }
};

/**
 * Handles HTTP requests for edition retrieval by ISBN.
 *
 * @param {Request} req - An HTTP request.
 * @param {Response} res - An HTTP response.
 * @returns {Promise<void>} A promise that resolves to void.
 * @throws - {@link NotFoundError}
 */
export const callEditionRetrievalByISBN = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { isbn } = req.body;
    const retrievedEdition = await getEditionByISBN(isbn);

    if (retrievedEdition === null) {
      throw new NotFoundError(
        editionControllerResponseMessages.EDITION_NOT_FOUND
      );
    }

    res
      .setHeader("x-api-version", apiVersionNumbers.VERSION_1_0)
      .status(httpCodes.OK)
      .json({
        message: editionControllerResponseMessages.EDITION_RETRIEVED,
        data: retrievedEdition,
      });
  } catch (error) {
    if (error instanceof ServerError || error instanceof NotFoundError) {
      appLogger.error(
        `Edition controller: ${callEditionRetrievalByISBN.name} -> ${error.name} detected and caught`
      );

      res.status(error.httpCode).json({ message: error.message });
      return;
    }
  }
};

/**
 * Handles HTTP requests for edition retrieval by book ID.
 *
 * @param {Request} req - An HTTP request.
 * @param {Response} res - An HTTP response.
 * @returns {Promise<void>} A promise that resolves to void.
 * @throws - {@link NotFoundError}
 */
export const callEditionRetrievalByBook = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { book } = req.body;

    const retrievedBook = await getBookById(book.id);
    if (retrievedBook === null) {
      throw new NotFoundError(bookControllerResponseMessages.BOOK_NOT_FOUND);
    }

    const retrievedEditions = await getEditionsByBook(retrievedBook);
    if (retrievedEditions.length === 0) {
      throw new NotFoundError(
        editionControllerResponseMessages.EDITION_S_NOT_FOUND
      );
    }

    res
      .setHeader("x-api-version", apiVersionNumbers.VERSION_1_0)
      .status(httpCodes.OK)
      .json({
        message: editionControllerResponseMessages.EDITION_S_RETRIEVED,
        data: retrievedEditions,
      });
  } catch (error) {
    if (error instanceof ServerError || error instanceof NotFoundError) {
      appLogger.error(
        `Edition controller: ${callEditionRetrievalByBook.name} -> ${error.name} detected and caught`
      );

      res.status(error.httpCode).json({ message: error.message });
      return;
    }
  }
};
