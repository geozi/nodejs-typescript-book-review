import {
  callBookAddition,
  callBookRetrievalByGenre,
  callBookRetrievalById,
  callBookRetrievalByTitle,
  callBookUpdate,
} from "controllers/bookController";
import { Router } from "express";
import { catchExpressValidationErrors } from "middleware/catchers/expressErrorCatcher";
import {
  bookAdditionRules,
  bookRetrievalByGenreRules,
  bookRetrievalByIdRules,
  bookRetrievalByTitleRules,
  bookUpdateRules,
} from "middleware/rules/bookRules";

export const bookRouter = Router();
bookRouter.get(
  "/genre",
  ...bookRetrievalByGenreRules(),
  catchExpressValidationErrors,
  callBookRetrievalByGenre
);
bookRouter.get(
  "/title",
  ...bookRetrievalByTitleRules(),
  catchExpressValidationErrors,
  callBookRetrievalByTitle
);
bookRouter.get(
  "/",
  ...bookRetrievalByIdRules(),
  catchExpressValidationErrors,
  callBookRetrievalById
);
bookRouter.post(
  "/",
  ...bookAdditionRules(),
  catchExpressValidationErrors,
  callBookAddition
);
bookRouter.put(
  "/",
  ...bookUpdateRules(),
  catchExpressValidationErrors,
  callBookUpdate
);
