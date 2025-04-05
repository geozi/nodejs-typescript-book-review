/**
 * RoleType assignment handler.
 * @module src/middleware/handlers/roleTypeAssignment
 */
import { NextFunction, Request, Response } from "express";
import { RoleType } from "resources/enum/RoleType";

/**
 * Adds a {@link RoleType} enum to the body of an HTTP request.
 *
 * @param {RoleType} role - A role assigned to each user.
 * @returns {Promise<void>} A promise that results to void.
 */
export const assignRoleType = (role: RoleType) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    req.body.role = role;
    next();
  };
};
