import {
  callEditionAddition,
  callEditionRetrievalByBook,
  callEditionRetrievalByISBN,
  callEditionUpdate,
} from "controllers/editionController";
import { Router } from "express";
import { catchExpressValidationErrors } from "middleware/catchers/expressErrorCatcher";
import {
  editionAdditionRules,
  editionRetrievalByBookRules,
  editionRetrievalByIsbnRules,
  editionUpdateRules,
} from "middleware/rules/editionRules";

export const editionRouter = Router();
editionRouter.get(
  "/isbn",
  ...editionRetrievalByIsbnRules(),
  catchExpressValidationErrors,
  callEditionRetrievalByISBN
);
editionRouter.get(
  "/book",
  ...editionRetrievalByBookRules(),
  catchExpressValidationErrors,
  callEditionRetrievalByBook
);
editionRouter.post(
  "/",
  ...editionAdditionRules(),
  catchExpressValidationErrors,
  callEditionAddition
);
editionRouter.put(
  "/",
  ...editionUpdateRules(),
  catchExpressValidationErrors,
  callEditionUpdate
);
