/**
 * RoleType assignment handler.
 * @module src/middleware/handlers/roleTypeAssignment
 */
import { NextFunction, Request, Response } from "express";
import { commonResponseMessages } from "messages/response/commonResponseMessages";
import { httpCodes } from "resources/codes/responseStatusCodes";
import { RoleType } from "resources/enum/RoleType";

/**
 * Adds a {@link RoleType} enum to the body of an HTTP request.
 *
 * @param {RoleType} role - A role assigned to each user.
 * @returns {void}
 */
export const assignRoleType = (role: RoleType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.body) {
      res.status(httpCodes.BAD_REQUEST).json({
        message: commonResponseMessages.REQUEST_BODY_REQUIRED_MESSAGE,
      });
      return;
    }
    req.body.role = role;
    next();
  };
};
