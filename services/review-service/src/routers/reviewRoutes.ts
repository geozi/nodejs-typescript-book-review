/**
 * Review routes.
 * @module src/routes/reviewRoutes
 */
import { forwardToAccountService } from "auth/requestForwarder";
import {
  callReviewAddition,
  callReviewRetrievalByBook,
  callReviewRetrievalById,
  callReviewRetrievalByIndex,
  callReviewRetrievalByUsername,
  callReviewUpdate,
} from "controllers/reviewController";
import { Router } from "express";
import { catchExpressValidationErrors } from "middleware/catchers/expressErrorCatcher";
import { assignRoleType } from "middleware/handlers/roleTypeAssignment";
import {
  reviewAdditionRules,
  reviewRetrievalByBookRules,
  reviewRetrievalByCompositeIndexRules,
  reviewRetrievalByIdRules,
  reviewUpdateRules,
} from "middleware/rules/reviewRules";
import { RoleType } from "resources/enum/RoleType";

export const reviewRouter = Router();
reviewRouter.post(
  "/",
  assignRoleType(RoleType.User),
  forwardToAccountService,
  ...reviewAdditionRules(),
  catchExpressValidationErrors,
  callReviewAddition
);
reviewRouter.put(
  "/",
  assignRoleType(RoleType.User),
  forwardToAccountService,
  ...reviewUpdateRules(),
  catchExpressValidationErrors,
  callReviewUpdate
);
reviewRouter.get(
  "/",
  assignRoleType(RoleType.User),
  forwardToAccountService,
  ...reviewRetrievalByIdRules(),
  catchExpressValidationErrors,
  callReviewRetrievalById
);
reviewRouter.get(
  "/book",
  assignRoleType(RoleType.User),
  forwardToAccountService,
  ...reviewRetrievalByBookRules(),
  catchExpressValidationErrors,
  callReviewRetrievalByBook
);
reviewRouter.get(
  "/username",
  assignRoleType(RoleType.User),
  forwardToAccountService,
  callReviewRetrievalByUsername
);
reviewRouter.get(
  "/comp-index",
  assignRoleType(RoleType.Admin),
  forwardToAccountService,
  ...reviewRetrievalByCompositeIndexRules(),
  catchExpressValidationErrors,
  callReviewRetrievalByIndex
);
