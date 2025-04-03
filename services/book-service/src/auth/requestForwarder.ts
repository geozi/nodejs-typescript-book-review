import axios from "axios";
import { ServerError } from "errors/serverErrorClass";
import { NextFunction, Request, Response } from "express";
import { appLogger } from "logs/loggerConfigs";
import { commonResponseMessages } from "messages/response/commonResponseMessages";
import { httpCodes } from "resources/codes/responseStatusCodes";

export const forwardToUserAccountService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const response = await axios({
      method: req.method,
      url: "http://localhost:3000/api/inter-service/user",
      headers: req.headers,
      data: req.body,
      params: req.query,
    });

    if (response.status === httpCodes.OK) {
      next();
    } else {
      res.status(response.status).json(response.data);
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    appLogger.error(
      `Request forwarder: ${forwardToUserAccountService.name} -> ServerError thrown`
    );

    throw new ServerError(commonResponseMessages.SERVER_ERROR_MESSAGE);
  }
};
