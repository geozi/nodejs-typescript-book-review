import { NextFunction, Request, Response } from "express";
import { RoleType } from "resources/enum/RoleType";

export const assignRoleType = (role: RoleType) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    req.body.role = role;
    next();
  };
};
