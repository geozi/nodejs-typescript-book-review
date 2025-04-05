/**
 * BookAuthor routes.
 * @module src/routes/bookAuthorRoutes
 */
import { forwardToAccountService } from "auth/requestForwarder";
import { callBookAuthorAddition } from "controllers/bookAuthorController";
import { NextFunction, Request, Response, Router } from "express";
import { catchExpressValidationErrors } from "middleware/catchers/expressErrorCatcher";
import { authorBookAdditionRules } from "middleware/rules/authorBookRules";
import { RoleType } from "resources/enum/RoleType";

export const bookAuthorRouter = Router();
bookAuthorRouter.post(
  "/",
  async (req: Request, _res: Response, next: NextFunction) => {
    req.body.role = RoleType.Admin;
    next();
  },
  forwardToAccountService,
  ...authorBookAdditionRules(),
  catchExpressValidationErrors,
  callBookAuthorAddition
);
