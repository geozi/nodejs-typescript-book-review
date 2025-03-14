import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { appLogger } from "../../logs/logger.config";
import { httpCodes } from "resources/codes/responseStatusCodes";
import { commonResponseMessages } from "messages/response/commonResponse.message";

export const catchExpressValidationErrors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const expressErrors = validationResult(req);
  if (!expressErrors.isEmpty()) {
    const errorMessage = expressErrors.array().map((err) => ({
      message: err.msg,
    }));

    appLogger.error(
      `${catchExpressValidationErrors.name} -> Express validation errors detected and caught`
    );

    res.status(httpCodes.BAD_REQUEST).json({
      message: commonResponseMessages.BAD_REQUEST,
      errors: errorMessage,
    });
    return;
  }

  next();
};
