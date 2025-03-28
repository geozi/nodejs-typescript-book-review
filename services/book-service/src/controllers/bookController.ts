import { ValidationError } from "class-validator";
import { Request, Response } from "express";
import { appLogger } from "../../logs/loggerConfigs";
import { reqBodyToBook, reqBodyToBookUpdate } from "mappers/bookMapper";
import { bookControllerResponseMessages } from "messages/response/bookControllerResponseMessages";
import {
  addBook,
  getBookById,
  getBookByTitle,
  updateBook,
} from "repositories/bookRepository";
import { apiVersionNumbers } from "resources/codes/apiVersionNumbers";
import { httpCodes } from "resources/codes/responseStatusCodes";
import { ServerError } from "errors/serverErrorClass";
import { NotFoundError } from "errors/notFoundErrorClass";
import { reqBodyToId } from "mappers/commonMapper";

export const callBookAddition = async (req: Request, res: Response) => {
  try {
    const newBook = reqBodyToBook(req);
    const savedBook = await addBook(newBook);

    res
      .setHeader("X-api-version", apiVersionNumbers.VERSION_1_0)
      .status(httpCodes.CREATED)
      .json({
        message: bookControllerResponseMessages.BOOK_ADDED,
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

    if (error instanceof ServerError) {
      appLogger.error(
        `Book controller: ${callBookAddition.name} -> ${error.name} detected and caught`
      );

      res.status(error.httpCode).json({ message: error.message });
      return;
    }
  }
};

export const callBookUpdate = async (req: Request, res: Response) => {
  try {
    const dataUpdateObject = reqBodyToBookUpdate(req);
    const id = dataUpdateObject.id;
    const bookToUpdate = dataUpdateObject.book;
    const updatedBook = await updateBook(id, bookToUpdate);

    if (updatedBook === null) {
      throw new NotFoundError(bookControllerResponseMessages.BOOK_NOT_FOUND);
    }

    res
      .setHeader("X-api-version", apiVersionNumbers.VERSION_1_0)
      .status(httpCodes.OK)
      .json({
        message: bookControllerResponseMessages.BOOK_UPDATED,
        data: updatedBook,
      });
  } catch (error) {
    if (error instanceof ServerError || error instanceof NotFoundError) {
      appLogger.error(
        `Author controller: ${callBookUpdate.name} -> ${error.name} detected and caught`
      );

      res.status(error.httpCode).json({ message: error.message });
      return;
    }
  }
};

export const callBookRetrievalByTitle = async (req: Request, res: Response) => {
  try {
    const { title } = req.body;
    const retrievedBook = await getBookByTitle(title);

    if (retrievedBook === null) {
      throw new NotFoundError(bookControllerResponseMessages.BOOK_NOT_FOUND);
    }

    res
      .setHeader("X-api-version", apiVersionNumbers.VERSION_1_0)
      .status(httpCodes.OK)
      .json({
        message: bookControllerResponseMessages.BOOK_RETRIEVED,
        data: retrievedBook,
      });
  } catch (error) {
    if (error instanceof ServerError || error instanceof NotFoundError) {
      appLogger.error(
        `Author controller: ${callBookRetrievalByTitle.name} -> ${error.name} detected and caught`
      );

      res.status(error.httpCode).json({ message: error.message });
      return;
    }
  }
};

export const callBookRetrievalById = async (req: Request, res: Response) => {
  try {
    const id = reqBodyToId(req);
    const retrievedBook = await getBookById(id);

    if (retrievedBook === null) {
      throw new NotFoundError(bookControllerResponseMessages.BOOK_NOT_FOUND);
    }

    res
      .setHeader("X-api-version", apiVersionNumbers.VERSION_1_0)
      .status(httpCodes.OK)
      .json({
        message: bookControllerResponseMessages.BOOK_RETRIEVED,
        data: retrievedBook,
      });
  } catch (error) {
    if (error instanceof ServerError || error instanceof NotFoundError) {
      appLogger.error(
        `Author controller: ${callBookRetrievalById.name} -> ${error.name} detected and caught`
      );

      res.status(error.httpCode).json({ message: error.message });
      return;
    }
  }
};
