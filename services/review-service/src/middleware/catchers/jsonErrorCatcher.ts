/**
 * JSON payload error catcher.
 * @module src/middleware/catchers/jsonErrorCatcher
 */
import { NextFunction, Request, Response } from "express";
import { appLogger } from "logs/loggerConfig";
import { commonResponseMessages } from "messages/response/commonResponseMessages";
import { httpCodes } from "resources/codes/responseStatusCodes";

/**
 * Handles JSON payload errors.
 *
 * @param {unknown} err - An error object.
 * @param {Request} _req - An HTTP request.
 * @param {Response} res - An HTTP response.
 * @param {NextFunction} next - A function moving program logic to the next step of the middleware path.
 * @returns {void}
 */
export const catchJSONerror = (
  err: unknown,
  _req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err instanceof SyntaxError && "body" in err) {
    appLogger.error(
      `JSON Error catcher: ${catchJSONerror.name} -> ${err.name} detected and caught`
    );

    res.status(httpCodes.BAD_REQUEST).send({
      error: commonResponseMessages.INVALID_JSON_MESSAGE,
    });
    return;
  }
  next(err);
};
