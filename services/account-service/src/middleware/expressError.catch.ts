/**
 * Express validation error catcher.
 * @module src/middleware/expressError.catch
 */
import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { appLogger } from "../../logs/logger.config";
import { httpCodes } from "resources/codes/responseStatusCodes";
import { commonResponseMessages } from "messages/response/commonResponseMessages";

/**
 * Handles express validation errors.
 *
 * @param {Request} req - An HTTP request.
 * @param {Response} res - An HTTP response.
 * @param {NextFunction} next - A function moving program logic to the next step of a middleware path.
 * @returns { Promise<void>} A promise that resolves to void.
 */
export const catchExpressValidationErrors = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const expressErrors = validationResult(req);
  if (!expressErrors.isEmpty()) {
    const errorMessage = expressErrors.array().map((err) => ({
      message: err.msg,
    }));

    appLogger.error(
      `${catchExpressValidationErrors.name} -> Express validation errors detected and caught`
    );

    res.status(httpCodes.BAD_REQUEST).json({
      message: commonResponseMessages.BAD_REQUEST_MESSAGE,
      errors: errorMessage,
    });
    return;
  }

  next();
};
