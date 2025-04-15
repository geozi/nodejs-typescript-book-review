/**
 * HTTP request forwarder.
 * @module src/auth/requestForwarder
 */
import axios, { AxiosError } from "axios";
import { ServerError } from "errors/serverErrorClass";
import { NextFunction, Request, Response } from "express";
import { appLogger } from "logs/loggerConfig";
import { commonResponseMessages } from "messages/response/commonResponseMessages";
import { httpCodes } from "resources/codes/responseStatusCodes";
import { RoleType } from "resources/enum/RoleType";

/**
 * Forwards HTTP requests to account-service for authorization.
 *
 * @param {Request} req - An HTTP request.
 * @param {Response} res - An HTTP response.
 * @param {NextFunction} next - Moves program logic to the next step of a middleware path.
 * @returns {Promise<void>} A promise that resolves to void.
 */
export const forwardToAccountService = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
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

    const headers = { ...response.headers };
    req.body.username = headers["x-user-name"];

    next();
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      const { status, statusText } = error.response;

      appLogger.error(
        `Account forwarder: ${forwardToAccountService.name} -> ${error.name} detected`
      );

      res.status(status).json(statusText);
      return;
    }
    appLogger.error(
      `Account forwarder: ${forwardToAccountService.name} -> ServerError thrown`
    );

    throw new ServerError(commonResponseMessages.SERVER_ERROR_MESSAGE);
  }
};
