import axios from "axios";
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
      headers: req.headers,
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
      `Request forwarder: ${forwardToAccountService.name} -> ServerError thrown`
    );

    throw new ServerError(commonResponseMessages.SERVER_ERROR_MESSAGE);
  }
};
