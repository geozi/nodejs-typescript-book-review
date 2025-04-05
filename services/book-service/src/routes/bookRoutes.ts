/**
 * Book routes.
 * @module src/routes/bookRoutes
 */
import { forwardToAccountService } from "auth/requestForwarder";
import {
  callBookAddition,
  callBookRetrievalByGenre,
  callBookRetrievalById,
  callBookRetrievalByTitle,
  callBookUpdate,
} from "controllers/bookController";
import { Router } from "express";
import { catchExpressValidationErrors } from "middleware/catchers/expressErrorCatcher";
import { assignRoleType } from "middleware/handlers/roleTypeAssignment";
import {
  bookAdditionRules,
  bookRetrievalByGenreRules,
  bookRetrievalByIdRules,
  bookRetrievalByTitleRules,
  bookUpdateRules,
} from "middleware/rules/bookRules";
import { RoleType } from "resources/enum/RoleType";

export const bookRouter = Router();
bookRouter.get(
  "/genre",
  assignRoleType(RoleType.User),
  forwardToAccountService,
  ...bookRetrievalByGenreRules(),
  catchExpressValidationErrors,
  callBookRetrievalByGenre
);
bookRouter.get(
  "/title",
  assignRoleType(RoleType.User),
  forwardToAccountService,
  ...bookRetrievalByTitleRules(),
  catchExpressValidationErrors,
  callBookRetrievalByTitle
);
bookRouter.get(
  "/",
  assignRoleType(RoleType.Admin),
  forwardToAccountService,
  ...bookRetrievalByIdRules(),
  catchExpressValidationErrors,
  callBookRetrievalById
);
bookRouter.post(
  "/",
  assignRoleType(RoleType.Admin),
  forwardToAccountService,
  ...bookAdditionRules(),
  catchExpressValidationErrors,
  callBookAddition
);
bookRouter.put(
  "/",
  assignRoleType(RoleType.Admin),
  forwardToAccountService,
  ...bookUpdateRules(),
  catchExpressValidationErrors,
  callBookUpdate
);
