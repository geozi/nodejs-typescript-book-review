import { forwardToAccountService } from "auth/requestForwarder";
import {
  callEditionAddition,
  callEditionRetrievalByBook,
  callEditionRetrievalByISBN,
  callEditionUpdate,
} from "controllers/editionController";
import { Router } from "express";
import { catchExpressValidationErrors } from "middleware/catchers/expressErrorCatcher";
import { assignRoleType } from "middleware/handlers/roleTypeAssignment";
import {
  editionAdditionRules,
  editionRetrievalByBookRules,
  editionRetrievalByIsbnRules,
  editionUpdateRules,
} from "middleware/rules/editionRules";
import { RoleType } from "resources/enum/RoleType";

export const editionRouter = Router();
editionRouter.get(
  "/isbn",
  assignRoleType(RoleType.Admin),
  forwardToAccountService,
  ...editionRetrievalByIsbnRules(),
  catchExpressValidationErrors,
  callEditionRetrievalByISBN
);
editionRouter.get(
  "/book",
  assignRoleType(RoleType.Admin),
  forwardToAccountService,
  ...editionRetrievalByBookRules(),
  catchExpressValidationErrors,
  callEditionRetrievalByBook
);
editionRouter.post(
  "/",
  assignRoleType(RoleType.Admin),
  forwardToAccountService,
  ...editionAdditionRules(),
  catchExpressValidationErrors,
  callEditionAddition
);
editionRouter.put(
  "/",
  assignRoleType(RoleType.Admin),
  forwardToAccountService,
  ...editionUpdateRules(),
  catchExpressValidationErrors,
  callEditionUpdate
);
