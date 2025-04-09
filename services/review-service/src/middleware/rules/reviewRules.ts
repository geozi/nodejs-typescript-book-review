import { body, check, ValidationChain } from "express-validator";
import { reviewFailedValidation } from "messages/validation/reviewValidationMessages";
import { reviewConstants } from "resources/constants/reviewConstants";

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
      .isInt()
      .withMessage(reviewFailedValidation.BOOK_ID_INVALID_MESSAGE)
      .bail()
      .custom(async (value) => {
        if (value < 0) {
          throw new Error(reviewFailedValidation.BOOK_ID_NEGATIVE_MESSAGE);
        }
      }),
  ];
};

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
      .isInt()
      .withMessage(reviewFailedValidation.BOOK_ID_INVALID_MESSAGE)
      .bail()
      .custom(async (value) => {
        if (value < 0) {
          throw new Error(reviewFailedValidation.BOOK_ID_NEGATIVE_MESSAGE);
        }
      }),
  ];
};
