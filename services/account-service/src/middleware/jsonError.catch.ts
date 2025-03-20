/**
 * JSON payload error catcher.
 * @module src/middleware/jsonError.catch
 */
import { Request, Response, NextFunction } from "express";
import { commonResponseMessages } from "messages/response/commonResponse.message";

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
    res.status(400).send({
      message: commonResponseMessages.BAD_REQUEST_MESSAGE,
      error: commonResponseMessages.INVALID_JSON_MESSAGE,
    });
    return;
  }
  next(err);
};
