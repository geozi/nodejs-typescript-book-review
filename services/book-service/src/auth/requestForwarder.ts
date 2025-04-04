import axios, { AxiosError } from "axios";
import { ServerError } from "errors/serverErrorClass";
import { NextFunction, Request, Response } from "express";
import { appLogger } from "logs/loggerConfigs";
import { commonResponseMessages } from "messages/response/commonResponseMessages";
import { httpCodes } from "resources/codes/responseStatusCodes";
import { RoleType } from "resources/enum/RoleType";

export const forwardToAccountService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let url = "http://localhost:3000/api/inter-service/";
    if (req.body.role && req.body.role === RoleType.Admin) {
      url += "admin";
    } else {
      url += "user";
    }

    const response = await axios({
      method: "GET",
      url: url,
      headers: { Authorization: req.header("Authorization") },
    });

    if (response.status !== httpCodes.OK) {
      res.status(response.status).json(response.statusText);
      return;
    }
    next();
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      const { status, statusText } = error.response;

      appLogger.error(
        `Request forwarder: ${forwardToAccountService.name} -> ${error.name} detected`
      );

      res.status(status).json(statusText);
      return;
    }
    appLogger.error(
      `Request forwarder: ${forwardToAccountService.name} -> ServerError thrown`
    );

    throw new ServerError(commonResponseMessages.SERVER_ERROR_MESSAGE);
  }
};
