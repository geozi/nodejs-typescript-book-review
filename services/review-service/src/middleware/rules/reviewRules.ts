/**
 * Express validation rules for review requests.
 * @module src/middleware/rules/reviewRules
 */
import { body, check, ValidationChain } from "express-validator";
import { reviewFailedValidation } from "messages/validation/reviewValidationMessages";
import { reviewConstants } from "resources/constants/reviewConstants";

/**
 * Returns a validation chain for review addition requests.
 * @returns {ValidationChain[]} Validation chain.
 */
export const reviewAdditionRules = (): ValidationChain[] => {
  return [
    check("subject")
      .notEmpty()
      .withMessage(reviewFailedValidation.SUBJECT_REQUIRED_MESSAGE)
      .bail()
      .isLength({ min: reviewConstants.SUBJECT_MIN_LENGTH })
      .withMessage(reviewFailedValidation.SUBJECT_BELOW_MIN_LENGTH_MESSAGE)
      .isLength({ max: reviewConstants.SUBJECT_MAX_LENGTH })
      .withMessage(reviewFailedValidation.SUBJECT_ABOVE_MAX_LENGTH_MESSAGE),
    check("description")
      .notEmpty()
      .withMessage(reviewFailedValidation.DESCRIPTION_REQUIRED_MESSAGE)
      .bail()
      .isLength({ min: reviewConstants.DESCRIPTION_MIN_LENGTH })
      .withMessage(reviewFailedValidation.DESCRIPTION_BELOW_MIN_LENGTH_MESSAGE)
      .isLength({ max: reviewConstants.DESCRIPTION_MAX_LENGTH })
      .withMessage(reviewFailedValidation.DESCRIPTION_ABOVE_MAX_LENGTH_MESSAGE),
    check("book")
      .notEmpty()
      .withMessage(reviewFailedValidation.BOOK_REQUIRED_MESSAGE)
      .bail(),
    check("book.id")
      .if(body("book").exists())
      .notEmpty()
      .withMessage(reviewFailedValidation.BOOK_ID_REQUIRED_MESSAGE)
      .bail()
      .custom(async (value) => {
        if (typeof value !== "number") {
          throw new Error(reviewFailedValidation.BOOK_ID_INVALID_MESSAGE);
        }
      })
      .bail()
      .custom(async (value) => {
        if (value < 0) {
          throw new Error(reviewFailedValidation.BOOK_ID_NEGATIVE_MESSAGE);
        }
      }),
    check("username")
      .notEmpty()
      .withMessage(reviewFailedValidation.USERNAME_REQUIRED_MESSAGE),
  ];
};

/**
 * Returns a validation chain for review update requests.
 * @returns {ValidationChain[]} Validation chain.
 */
export const reviewUpdateRules = (): ValidationChain[] => {
  return [
    check("id")
      .notEmpty()
      .withMessage(reviewFailedValidation.REVIEW_ID_REQUIRED_MESSAGE)
      .bail()
      .isMongoId()
      .withMessage(reviewFailedValidation.REVIEW_ID_INVALID_MESSAGE)
      .bail(),
    check("subject")
      .optional()
      .isLength({ min: reviewConstants.SUBJECT_MIN_LENGTH })
      .withMessage(reviewFailedValidation.SUBJECT_BELOW_MIN_LENGTH_MESSAGE)
      .isLength({ max: reviewConstants.SUBJECT_MAX_LENGTH })
      .withMessage(reviewFailedValidation.SUBJECT_ABOVE_MAX_LENGTH_MESSAGE),
    check("description")
      .optional()
      .isLength({ min: reviewConstants.DESCRIPTION_MIN_LENGTH })
      .withMessage(reviewFailedValidation.DESCRIPTION_BELOW_MIN_LENGTH_MESSAGE)
      .isLength({ max: reviewConstants.DESCRIPTION_MAX_LENGTH })
      .withMessage(reviewFailedValidation.DESCRIPTION_ABOVE_MAX_LENGTH_MESSAGE),
    check("book").optional(),
    check("book.id")
      .if(body("book").exists())
      .notEmpty()
      .withMessage(reviewFailedValidation.BOOK_ID_REQUIRED_MESSAGE)
      .bail()
      .custom(async (value) => {
        if (typeof value !== "number") {
          throw new Error(reviewFailedValidation.BOOK_ID_INVALID_MESSAGE);
        }
      })
      .bail()
      .custom(async (value) => {
        if (value < 0) {
          throw new Error(reviewFailedValidation.BOOK_ID_NEGATIVE_MESSAGE);
        }
      }),
  ];
};

/**
 * Returns a validation chain for review retrieval by ID requests.
 * @returns {ValidationChain[]} Validation chain.
 */
export const reviewRetrievalByIdRules = (): ValidationChain[] => {
  return [
    check("id")
      .notEmpty()
      .withMessage(reviewFailedValidation.REVIEW_ID_REQUIRED_MESSAGE)
      .bail()
      .isMongoId()
      .withMessage(reviewFailedValidation.REVIEW_ID_INVALID_MESSAGE)
      .bail(),
  ];
};

/**
 * Returns a validation chain for review retrieval by book requests.
 * @returns {ValidationChain[]} Validation chain.
 */
export const reviewRetrievalByBookRules = (): ValidationChain[] => {
  return [
    check("book")
      .notEmpty()
      .withMessage(reviewFailedValidation.BOOK_REQUIRED_MESSAGE)
      .bail(),
    check("book.id")
      .if(body("book").exists())
      .notEmpty()
      .withMessage(reviewFailedValidation.BOOK_ID_REQUIRED_MESSAGE)
      .bail()
      .custom(async (value) => {
        if (typeof value !== "number") {
          throw new Error(reviewFailedValidation.BOOK_ID_INVALID_MESSAGE);
        }
      })
      .bail()
      .custom(async (value) => {
        if (value < 0) {
          throw new Error(reviewFailedValidation.BOOK_ID_NEGATIVE_MESSAGE);
        }
      }),
  ];
};

/**
 * Returns a validation chain for review retrieval by index requests.
 * @returns {ValidationChain[]} Validation chain.
 */
export const reviewRetrievalByCompositeIndexRules = (): ValidationChain[] => {
  return [
    check("subject")
      .notEmpty()
      .withMessage(reviewFailedValidation.SUBJECT_REQUIRED_MESSAGE)
      .bail()
      .isLength({ min: reviewConstants.SUBJECT_MIN_LENGTH })
      .withMessage(reviewFailedValidation.SUBJECT_BELOW_MIN_LENGTH_MESSAGE)
      .isLength({ max: reviewConstants.SUBJECT_MAX_LENGTH })
      .withMessage(reviewFailedValidation.SUBJECT_ABOVE_MAX_LENGTH_MESSAGE),
    check("username")
      .notEmpty()
      .withMessage(reviewFailedValidation.USERNAME_REQUIRED_MESSAGE),
  ];
};
