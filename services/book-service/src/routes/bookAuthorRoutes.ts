/**
 * BookAuthor routes.
 * @module src/routes/bookAuthorRoutes
 */
import { forwardToAccountService } from "auth/requestForwarder";
import { callBookAuthorAddition } from "controllers/bookAuthorController";
import { Router } from "express";
import { catchExpressValidationErrors } from "middleware/catchers/expressErrorCatcher";
import { assignRoleType } from "middleware/handlers/roleTypeAssignment";
import { authorBookAdditionRules } from "middleware/rules/authorBookRules";
import { RoleType } from "resources/enum/RoleType";

export const bookAuthorRouter = Router();
bookAuthorRouter.post(
  "/",
  assignRoleType(RoleType.Admin),
  forwardToAccountService,
  ...authorBookAdditionRules(),
  catchExpressValidationErrors,
  callBookAuthorAddition
);
