import { check, ValidationChain } from "express-validator";
import { editionFailedValidation } from "messages/validation/editionValidationMessages";
import { editionConstants } from "resources/constants/editionConstants";
import { bookFormatArray } from "resources/enum/BookFormat";
import { ALPHABETIC_REGEX } from "resources/regexp/validationRegExp";

export const editionAdditionRules = (): ValidationChain[] => {
  return [
    check("isbn")
      .notEmpty()
      .withMessage(editionFailedValidation.ISBN_REQUIRED_MESSAGE)
      .bail()
      .isISBN(editionConstants.ISBN_13_LENGTH)
      .withMessage(editionFailedValidation.ISBN_INVALID_MESSAGE),
    check("publicationDate")
      .notEmpty()
      .withMessage(editionFailedValidation.PUBLICATION_DATE_REQUIRED_MESSAGE)
      .bail()
      .isDate({ format: "YYYY-MM-DD", strictMode: true })
      .withMessage(editionFailedValidation.PUBLICATION_DATE_INVALID_MESSAGE),
    check("publisher")
      .notEmpty()
      .withMessage(editionFailedValidation.PUBLISHER_REQUIRED_MESSAGE)
      .bail()
      .isLength({ min: editionConstants.PUBLISHER_MIN_LENGTH })
      .withMessage(editionFailedValidation.PUBLISHER_BELOW_MIN_LENGTH_MESSAGE)
      .isLength({ max: editionConstants.PUBLISHER_MAX_LENGTH })
      .withMessage(editionFailedValidation.PUBLISHER_ABOVE_MAX_LENGTH_MESSAGE),
    check("pageCount")
      .notEmpty()
      .withMessage(editionFailedValidation.PAGE_COUNT_REQUIRED_MESSAGE)
      .bail()
      .isNumeric()
      .withMessage(editionFailedValidation.PAGE_COUNT_INVALID_MESSAGE)
      .custom(async (value) => {
        if (value < 0) {
          throw new Error(editionFailedValidation.PAGE_COUNT_NEGATIVE_MESSAGE);
        }

        if (value < editionConstants.MIN_PAGE_COUNT) {
          throw new Error(editionFailedValidation.PAGE_COUNT_MINIMUM_MESSAGE);
        }
      }),
    check("bookFormat")
      .notEmpty()
      .withMessage(editionFailedValidation.BOOK_FORMAT_REQUIRED_MESSAGE)
      .bail()
      .isIn(bookFormatArray)
      .withMessage(editionFailedValidation.BOOK_FORMAT_INVALID_MESSAGE),
    check("bookLanguage")
      .notEmpty()
      .withMessage(editionFailedValidation.LANGUAGE_REQUIRED_MESSAGE)
      .bail()
      .matches(ALPHABETIC_REGEX)
      .withMessage(editionFailedValidation.LANGUAGE_INVALID_MESSAGE)
      .isLength({ min: editionConstants.LANGUAGE_MIN_LENGTH })
      .withMessage(editionFailedValidation.LANGUAGE_MIN_LENGTH_MESSAGE),
  ];
};
