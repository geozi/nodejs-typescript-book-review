import { ValidationError } from "class-validator";
import { NotFoundError } from "errors/notFoundErrorClass";
import { ServerError } from "errors/serverErrorClass";
import { Request, Response } from "express";
import { appLogger } from "logs/loggerConfigs";
import { reqBodyToAuthor, reqBodyToAuthorUpdate } from "mappers/authorMapper";
import { authorControllerResponseMessages } from "messages/response/authorControllerResponseMessages";
import {
  addAuthor,
  getAuthorById,
  updateAuthor,
} from "repositories/authorRepository";
import { apiVersionNumbers } from "resources/codes/apiVersionNumbers";
import { httpCodes } from "resources/codes/responseStatusCodes";

export const callAuthorAddition = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const newAuthor = reqBodyToAuthor(req);
    const savedAuthor = await addAuthor(newAuthor);

    res
      .setHeader("x-api-version", apiVersionNumbers.VERSION_1_0)
      .status(httpCodes.CREATED)
      .json({
        message: authorControllerResponseMessages.AUTHOR_ADDED,
        data: savedAuthor,
      });
  } catch (error) {
    if (error instanceof ValidationError) {
      appLogger.error(
        `Author controller: ${callAuthorAddition.name} -> ValidationError detected and caught`
      );

      res.status(httpCodes.BAD_REQUEST).json(error.constraints);
      return;
    }

    if (error instanceof ServerError) {
      appLogger.error(
        `Author controller: ${callAuthorAddition.name} -> ${error.name} detected and caught`
      );

      res.status(error.httpCode).json({ message: error.message });
      return;
    }
  }
};

export const callAuthorUpdate = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const dataUpdateObject = reqBodyToAuthorUpdate(req);
    const id = dataUpdateObject.id;
    const authorToUpdate = dataUpdateObject.author;
    const updatedAuthor = await updateAuthor(id, authorToUpdate);

    if (updatedAuthor === null) {
      throw new NotFoundError(
        authorControllerResponseMessages.AUTHOR_NOT_FOUND
      );
    }

    res
      .setHeader("x-api-version", apiVersionNumbers.VERSION_1_0)
      .status(httpCodes.OK)
      .json({
        message: authorControllerResponseMessages.AUTHOR_UPDATED,
        data: updatedAuthor,
      });
  } catch (error) {
    if (error instanceof ServerError || error instanceof NotFoundError) {
      appLogger.error(
        `Author controller: ${callAuthorUpdate.name} -> ${error.name} detected and caught`
      );

      res.status(error.httpCode).json({ message: error.message });
      return;
    }
  }
};

export const callAuthorRetrievalById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.body;
    const retrievedAuthor = await getAuthorById(id);

    if (retrievedAuthor === null) {
      throw new NotFoundError(
        authorControllerResponseMessages.AUTHOR_NOT_FOUND
      );
    }

    res
      .setHeader("x-api-version", apiVersionNumbers.VERSION_1_0)
      .status(httpCodes.OK)
      .json({
        message: authorControllerResponseMessages.AUTHOR_RETRIEVED,
        data: retrievedAuthor,
      });
  } catch (error) {
    if (error instanceof ServerError || error instanceof NotFoundError) {
      appLogger.error(
        `Author controller: ${callAuthorRetrievalById.name} -> ${error.name} detected and caught`
      );

      res.status(error.httpCode).json({ message: error.message });
      return;
    }
  }
};
