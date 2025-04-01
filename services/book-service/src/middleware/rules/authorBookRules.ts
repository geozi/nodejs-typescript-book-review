import { check, ValidationChain } from "express-validator";
import { authorFailedValidation } from "messages/validation/authorValidationMessages";
import { bookFailedValidation } from "messages/validation/bookValidationMessages";

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
