import { ValidationError } from "class-validator";
import { NotFoundError } from "errors/notFoundErrorClass";
import { ServerError } from "errors/serverErrorClass";
import { Request, Response } from "express";
import { appLogger } from "logs/loggerConfigs";
import { reqBodyToId } from "mappers/commonMapper";
import {
  reqBodyToEdition,
  reqBodyToEditionUpdate,
} from "mappers/editionMapper";
import { bookControllerResponseMessages } from "messages/response/bookControllerResponseMessages";
import { commonResponseMessages } from "messages/response/commonResponseMessages";
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

export const callEditionAddition = async (req: Request, res: Response) => {
  try {
    const newEdition = reqBodyToEdition(req);
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

    if (error instanceof ServerError) {
      appLogger.error(
        `Edition controller: ${callEditionAddition.name} -> ${error.name} detected and caught`
      );

      res
        .status(error.httpCode)
        .json({ message: commonResponseMessages.SERVER_ERROR_MESSAGE });
      return;
    }
  }
};

export const callEditionUpdate = async (req: Request, res: Response) => {
  try {
    const updateDataObject = reqBodyToEditionUpdate(req);
    const id = updateDataObject.id;
    const editionToUpdate = updateDataObject.edition;
    const updatedEdition = await updateEdition(id, editionToUpdate);

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

export const callEditionRetrievalByISBN = async (
  req: Request,
  res: Response
) => {
  try {
    const { isbn } = req.body;
    const retrievedEdition = await getEditionByISBN(isbn);

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

export const callEditionRetrievalByBook = async (
  req: Request,
  res: Response
) => {
  try {
    const id = reqBodyToId(req);

    const book = await getBookById(id);
    if (book === null) {
      throw new NotFoundError(bookControllerResponseMessages.BOOK_NOT_FOUND);
    }

    const retrievedEditions = await getEditionsByBook(book);
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
