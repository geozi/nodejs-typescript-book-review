import { Request, Response, NextFunction } from "express";
import { commonResponseMessages } from "messages/response/commonResponse.message";

export const catchJSONerror = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof SyntaxError && "body" in err) {
    res.status(400).send({
      message: commonResponseMessages.BAD_REQUEST,
      error: commonResponseMessages.INVALID_JSON,
    });
    return;
  }
  next(err);
};
