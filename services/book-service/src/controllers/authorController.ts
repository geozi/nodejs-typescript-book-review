import { ValidationError } from "class-validator";
import { ServerError } from "errors/serverErrorClass";
import { Request, Response } from "express";
import { appLogger } from "../../logs/loggerConfigs";
import { reqBodyToAuthor } from "mappers/authorMapper";
import { authorControllerResponseMessages } from "messages/response/authorControllerResponseMessages";
import { addAuthor } from "repositories/authorRepository";
import { httpCodes } from "resources/codes/responseStatusCodes";
import { apiVersionNumbers } from "resources/codes/apiVersionNumbers";

export const callAuthorAddition = async (req: Request, res: Response) => {
  try {
    const newAuthor = reqBodyToAuthor(req);
    const savedAuthor = await addAuthor(newAuthor);

    res
      .setHeader("X-api-version", apiVersionNumbers.VERSION_1_0)
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
