import { check, ValidationChain } from "express-validator";
import { bookFailedValidation } from "messages/validation/bookValidationMessages";
import { bookConstants } from "resources/constants/bookConstants";
import { genreArray } from "resources/enum/Genre";

export const bookAdditionRules = (): ValidationChain[] => {
  return [
    check("title")
      .notEmpty()
      .withMessage(bookFailedValidation.TITLE_REQUIRED_MESSAGE)
      .bail()
      .isLength({ min: bookConstants.TITLE_MIN_LENGTH })
      .withMessage(bookFailedValidation.TITLE_BELOW_MIN_LENGTH_MESSAGE)
      .isLength({ max: bookConstants.TITLE_MAX_LENGTH })
      .withMessage(bookFailedValidation.TITLE_ABOVE_MAX_LENGTH_MESSAGE),
    check("genre")
      .notEmpty()
      .withMessage(bookFailedValidation.GENRE_REQUIRED_MESSAGE)
      .bail()
      .isIn(genreArray)
      .withMessage(bookFailedValidation.GENRE_INVALID_MESSAGE),
  ];
};

export const bookUpdateRules = (): ValidationChain[] => {
  return [
    check("id")
      .notEmpty()
      .withMessage(bookFailedValidation.BOOK_ID_REQUIRED_MESSAGE)
      .bail()
      .isNumeric()
      .withMessage(bookFailedValidation.BOOK_ID_INVALID_MESSAGE),
    check("title")
      .optional()
      .isLength({ min: bookConstants.TITLE_MIN_LENGTH })
      .withMessage(bookFailedValidation.TITLE_BELOW_MIN_LENGTH_MESSAGE)
      .isLength({ max: bookConstants.TITLE_MAX_LENGTH })
      .withMessage(bookFailedValidation.TITLE_ABOVE_MAX_LENGTH_MESSAGE),
    check("genre")
      .optional()
      .isIn(genreArray)
      .withMessage(bookFailedValidation.GENRE_INVALID_MESSAGE),
  ];
};

export const bookRetrievalByTitleRules = (): ValidationChain[] => {
  return [
    check("title")
      .notEmpty()
      .withMessage(bookFailedValidation.TITLE_REQUIRED_MESSAGE)
      .bail()
      .isLength({ min: bookConstants.TITLE_MIN_LENGTH })
      .withMessage(bookFailedValidation.TITLE_BELOW_MIN_LENGTH_MESSAGE)
      .isLength({ max: bookConstants.TITLE_MAX_LENGTH })
      .withMessage(bookFailedValidation.TITLE_ABOVE_MAX_LENGTH_MESSAGE),
  ];
};

export const bookRetrievalByIdRules = (): ValidationChain[] => {
  return [
    check("id")
      .notEmpty()
      .withMessage(bookFailedValidation.BOOK_ID_REQUIRED_MESSAGE)
      .bail()
      .isNumeric()
      .withMessage(bookFailedValidation.BOOK_ID_INVALID_MESSAGE),
  ];
};

export const bookRetrievalByGenreRules = (): ValidationChain[] => {
  return [
    check("genre")
      .notEmpty()
      .withMessage(bookFailedValidation.GENRE_REQUIRED_MESSAGE)
      .bail()
      .isIn(genreArray)
      .withMessage(bookFailedValidation.GENRE_INVALID_MESSAGE),
  ];
};
