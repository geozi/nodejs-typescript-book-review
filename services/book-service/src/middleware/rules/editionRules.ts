import { body, check, ValidationChain } from "express-validator";
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
      .isInt()
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
    check("book")
      .notEmpty()
      .withMessage(editionFailedValidation.BOOK_REQUIRED_MESSAGE)
      .bail(),
    check("book.id")
      .if(body("book").exists())
      .notEmpty()
      .withMessage(editionFailedValidation.BOOK_ID_REQUIRED_MESSAGE)
      .bail()
      .isInt()
      .withMessage(editionFailedValidation.BOOK_ID_INVALID_MESSAGE),
  ];
};

export const editionUpdateRules = (): ValidationChain[] => {
  return [
    check("id")
      .notEmpty()
      .withMessage(editionFailedValidation.EDITION_ID_REQUIRED_MESSAGE)
      .bail()
      .isInt()
      .withMessage(editionFailedValidation.EDITION_ID_INVALID_MESSAGE),
    check("isbn")
      .optional()
      .isISBN(editionConstants.ISBN_13_LENGTH)
      .withMessage(editionFailedValidation.ISBN_INVALID_MESSAGE),
    check("publicationDate")
      .optional()
      .isDate({ format: "YYYY-MM-DD", strictMode: true })
      .withMessage(editionFailedValidation.PUBLICATION_DATE_INVALID_MESSAGE),
    check("publisher")
      .optional()
      .isLength({ min: editionConstants.PUBLISHER_MIN_LENGTH })
      .withMessage(editionFailedValidation.PUBLISHER_BELOW_MIN_LENGTH_MESSAGE)
      .isLength({ max: editionConstants.PUBLISHER_MAX_LENGTH })
      .withMessage(editionFailedValidation.PUBLISHER_ABOVE_MAX_LENGTH_MESSAGE),
    check("pageCount")
      .optional()
      .isInt()
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
      .optional()
      .isIn(bookFormatArray)
      .withMessage(editionFailedValidation.BOOK_FORMAT_INVALID_MESSAGE),
    check("bookLanguage")
      .optional()
      .matches(ALPHABETIC_REGEX)
      .withMessage(editionFailedValidation.LANGUAGE_INVALID_MESSAGE)
      .isLength({ min: editionConstants.LANGUAGE_MIN_LENGTH })
      .withMessage(editionFailedValidation.LANGUAGE_MIN_LENGTH_MESSAGE),
    check("book").optional(),
    check("book.id")
      .if(body("book").exists())
      .notEmpty()
      .withMessage(editionFailedValidation.BOOK_ID_REQUIRED_MESSAGE)
      .bail()
      .isInt()
      .withMessage(editionFailedValidation.BOOK_ID_INVALID_MESSAGE),
  ];
};

export const editionRetrievalByIsbnRules = (): ValidationChain[] => {
  return [
    check("isbn")
      .notEmpty()
      .withMessage(editionFailedValidation.ISBN_REQUIRED_MESSAGE)
      .bail()
      .isISBN(editionConstants.ISBN_13_LENGTH)
      .withMessage(editionFailedValidation.ISBN_INVALID_MESSAGE),
  ];
};

export const editionRetrievalByBookRules = (): ValidationChain[] => {
  return [
    check("book")
      .notEmpty()
      .withMessage(editionFailedValidation.BOOK_REQUIRED_MESSAGE)
      .bail(),
    check("book.id")
      .if(body("book").exists())
      .notEmpty()
      .withMessage(editionFailedValidation.BOOK_ID_REQUIRED_MESSAGE)
      .bail()
      .isInt()
      .withMessage(editionFailedValidation.BOOK_ID_INVALID_MESSAGE),
  ];
};
