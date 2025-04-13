import { NextFunction, Request, Response } from "express";
import { appLogger } from "logs/loggerConfig";
import { commonResponseMessages } from "messages/response/commonResponseMessages";

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

    res.status(400).send({
      error: commonResponseMessages.INVALID_JSON_MESSAGE,
    });
    return;
  }
  next(err);
};
