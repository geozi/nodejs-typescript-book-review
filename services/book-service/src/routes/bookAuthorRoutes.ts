import { callBookAuthorAddition } from "controllers/bookAuthorController";
import { Router } from "express";
import { catchExpressValidationErrors } from "middleware/catchers/expressErrorCatcher";
import { authorBookAdditionRules } from "middleware/rules/authorBookRules";

export const bookAuthorRouter = Router();
bookAuthorRouter.post(
  "/",
  ...authorBookAdditionRules(),
  catchExpressValidationErrors,
  callBookAuthorAddition
);
