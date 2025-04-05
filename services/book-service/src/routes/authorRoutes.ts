import { forwardToAccountService } from "auth/requestForwarder";
import {
  callAuthorAddition,
  callAuthorRetrievalById,
  callAuthorUpdate,
} from "controllers/authorController";
import { Router } from "express";
import { catchExpressValidationErrors } from "middleware/catchers/expressErrorCatcher";
import { assignRoleType } from "middleware/handlers/roleTypeAssignment";
import {
  authorAdditionRules,
  authorRetrievalByIdRules,
  authorUpdateRules,
} from "middleware/rules/authorRules";
import { RoleType } from "resources/enum/RoleType";

export const authorRouter = Router();
authorRouter.get(
  "/",
  assignRoleType(RoleType.Admin),
  forwardToAccountService,
  ...authorRetrievalByIdRules(),
  catchExpressValidationErrors,
  callAuthorRetrievalById
);
authorRouter.post(
  "/",
  assignRoleType(RoleType.Admin),
  forwardToAccountService,
  ...authorAdditionRules(),
  catchExpressValidationErrors,
  callAuthorAddition
);
authorRouter.put(
  "/",
  assignRoleType(RoleType.Admin),
  forwardToAccountService,
  ...authorUpdateRules(),
  catchExpressValidationErrors,
  callAuthorUpdate
);
