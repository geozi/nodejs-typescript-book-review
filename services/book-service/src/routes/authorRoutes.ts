import { forwardToAccountService } from "auth/requestForwarder";
import {
  callAuthorAddition,
  callAuthorRetrievalById,
  callAuthorUpdate,
} from "controllers/authorController";
import { Request, Router } from "express";
import { catchExpressValidationErrors } from "middleware/catchers/expressErrorCatcher";
import {
  authorAdditionRules,
  authorRetrievalByIdRules,
  authorUpdateRules,
} from "middleware/rules/authorRules";
import { RoleType } from "resources/enum/RoleType";

export const authorRouter = Router();
authorRouter.get(
  "/",
  ...authorRetrievalByIdRules(),
  catchExpressValidationErrors,
  callAuthorRetrievalById
);
authorRouter.post(
  "/",
  (req: Request) => {
    req.body.role = RoleType.Admin;
  },
  forwardToAccountService,
  ...authorAdditionRules(),
  catchExpressValidationErrors,
  callAuthorAddition
);
authorRouter.put(
  "/",
  ...authorUpdateRules(),
  catchExpressValidationErrors,
  callAuthorUpdate
);
