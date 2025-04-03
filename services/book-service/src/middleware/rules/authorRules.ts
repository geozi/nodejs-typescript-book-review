/**
 * Express validation rules for author requests.
 * @module src/middleware/rules/authorRules
 */
import { check, ValidationChain } from "express-validator";
import { authorFailedValidation } from "messages/validation/authorValidationMessages";
import { authorConstants } from "resources/constants/authorConstants";
import { ALPHABETIC_REGEX } from "resources/regexp/validationRegExp";

/**
 * Returns a validation chain for author addition requests.
 * @returns {ValidationChain[]} Validation chain.
 */
export const authorAdditionRules = (): ValidationChain[] => {
  return [
    check("firstName")
      .notEmpty()
      .withMessage(authorFailedValidation.FIRST_NAME_REQUIRED_MESSAGE)
      .bail()
      .isLength({ min: authorConstants.NAME_MIN_LENGTH })
      .withMessage(authorFailedValidation.FIRST_NAME_BELOW_MIN_LENGTH_MESSAGE)
      .matches(ALPHABETIC_REGEX)
      .withMessage(authorFailedValidation.FIRST_NAME_INVALID_MESSAGE),
    check("lastName")
      .notEmpty()
      .withMessage(authorFailedValidation.LAST_NAME_REQUIRED_MESSAGE)
      .bail()
      .isLength({ min: authorConstants.NAME_MIN_LENGTH })
      .withMessage(authorFailedValidation.LAST_NAME_BELOW_MIN_LENGTH_MESSAGE)
      .matches(ALPHABETIC_REGEX)
      .withMessage(authorFailedValidation.LAST_NAME_INVALID_MESSAGE),
  ];
};

/**
 * Returns a validation chain for author update requests.
 * @returns {ValidationChain[]} Validation chain.
 */
export const authorUpdateRules = (): ValidationChain[] => {
  return [
    check("id")
      .notEmpty()
      .withMessage(authorFailedValidation.AUTHOR_ID_REQUIRED_MESSAGE)
      .bail()
      .isInt()
      .withMessage(authorFailedValidation.AUTHOR_ID_INVALID_MESSAGE),
    check("firstName")
      .optional()
      .isLength({ min: authorConstants.NAME_MIN_LENGTH })
      .withMessage(authorFailedValidation.FIRST_NAME_BELOW_MIN_LENGTH_MESSAGE)
      .matches(ALPHABETIC_REGEX)
      .withMessage(authorFailedValidation.FIRST_NAME_INVALID_MESSAGE),
    check("lastName")
      .optional()
      .isLength({ min: authorConstants.NAME_MIN_LENGTH })
      .withMessage(authorFailedValidation.LAST_NAME_BELOW_MIN_LENGTH_MESSAGE)
      .matches(ALPHABETIC_REGEX)
      .withMessage(authorFailedValidation.LAST_NAME_INVALID_MESSAGE),
  ];
};

/**
 * Returns a validation chain for author retrieval by ID requests.
 * @returns {ValidationChain[]} Validation chain.
 */
export const authorRetrievalByIdRules = (): ValidationChain[] => {
  return [
    check("id")
      .notEmpty()
      .withMessage(authorFailedValidation.AUTHOR_ID_REQUIRED_MESSAGE)
      .bail()
      .isInt()
      .withMessage(authorFailedValidation.AUTHOR_ID_INVALID_MESSAGE),
  ];
};
