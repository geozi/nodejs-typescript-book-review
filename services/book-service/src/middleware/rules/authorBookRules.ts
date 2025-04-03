/**
 * Express validation rules for intermediary table requests.
 * @module src/middleware/rules/authorBookRules
 */
import { check, ValidationChain } from "express-validator";
import { authorFailedValidation } from "messages/validation/authorValidationMessages";
import { bookFailedValidation } from "messages/validation/bookValidationMessages";

/**
 * Returns a validation chain for record addition requests in intermediary table.
 * @returns {ValidationChain[]} Validation chain.
 */
export const authorBookAdditionRules = (): ValidationChain[] => {
  return [
    check("bookId")
      .notEmpty()
      .withMessage(bookFailedValidation.BOOK_ID_REQUIRED_MESSAGE)
      .bail()
      .isInt()
      .withMessage(bookFailedValidation.BOOK_ID_INVALID_MESSAGE),
    check("authorId")
      .notEmpty()
      .withMessage(authorFailedValidation.AUTHOR_ID_REQUIRED_MESSAGE)
      .bail()
      .isInt()
      .withMessage(authorFailedValidation.AUTHOR_ID_INVALID_MESSAGE),
  ];
};
