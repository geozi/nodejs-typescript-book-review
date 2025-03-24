/**
 * Person routes.
 * @module src/routes/person.route
 */
import {
  callPersonAddition,
  callPersonUpdate,
  retrievePersonInfo,
} from "controllers/personController";
import { Router } from "express";
import { catchExpressValidationErrors } from "middleware/catchers/expressErrorCatcher";
import {
  personInfoAdditionRules,
  personInfoUpdateRules,
} from "middleware/rules/personRules";

export const personRouter = Router();
personRouter.post(
  "/",
  ...personInfoAdditionRules(),
  catchExpressValidationErrors,
  callPersonAddition
);
personRouter.put(
  "/",
  ...personInfoUpdateRules(),
  catchExpressValidationErrors,
  callPersonUpdate
);
personRouter.get("/username", retrievePersonInfo);
