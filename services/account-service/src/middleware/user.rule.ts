/**
 * Express validation rules for user registration and update operations.
 * @module src/middleware/user.rule
 */
import { check, ValidationChain } from "express-validator";
import { userFailedValidation } from "messages/validation/userValidation.message";
import { userConstants } from "resources/constants/user.constant";
import { RoleType } from "resources/enums/roleType.enum";
import { EMAIL_REGEX, PASSWORD_REGEX } from "resources/regExp/validationRegExp";

/**
 * Returns a validation chain for user registration.
 * @returns {ValidationChain[]} Validation chain.
 */
export const userRegistrationRules = (): ValidationChain[] => {
  return [
    check("username")
      .notEmpty()
      .withMessage(userFailedValidation.USERNAME_REQUIRED_MESSAGE)
      .bail()
      .isLength({ min: userConstants.USERNAME_MIN_LENGTH })
      .withMessage(userFailedValidation.USERNAME_BELOW_MIN_LENGTH_MESSAGE)
      .isLength({ max: userConstants.USERNAME_MAX_LENGTH })
      .withMessage(userFailedValidation.USERNAME_ABOVE_MAX_LENGTH_MESSAGE),
    check("email")
      .notEmpty()
      .withMessage(userFailedValidation.EMAIL_REQUIRED_MESSAGE)
      .bail()
      .matches(EMAIL_REGEX)
      .withMessage(userFailedValidation.EMAIL_INVALID_MESSAGE),
    check("password")
      .notEmpty()
      .withMessage(userFailedValidation.PASSWORD_REQUIRED_MESSAGE)
      .bail()
      .isLength({ min: userConstants.PASSWORD_MIN_LENGTH })
      .withMessage(userFailedValidation.PASSWORD_BELOW_MIN_LENGTH_MESSAGE)
      .matches(PASSWORD_REGEX)
      .withMessage(userFailedValidation.PASSWORD_MUST_HAVE_CHARACTERS_MESSAGE),
    check("role")
      .notEmpty()
      .withMessage(userFailedValidation.ROLE_REQUIRED_MESSAGE)
      .bail()
      .isIn([RoleType.Admin, RoleType.User])
      .withMessage(userFailedValidation.ROLE_INVALID_MESSAGE),
  ];
};

/**
 * Returns a validation chain for user update.
 * @returns {ValidationChain[]} Validation chain.
 */
export const userUpdateRules = (): ValidationChain[] => {
  return [
    check("email")
      .optional()
      .matches(EMAIL_REGEX)
      .withMessage(userFailedValidation.EMAIL_INVALID_MESSAGE),
    check("password")
      .optional()
      .isLength({ min: userConstants.PASSWORD_MIN_LENGTH })
      .withMessage(userFailedValidation.PASSWORD_BELOW_MIN_LENGTH_MESSAGE)
      .matches(PASSWORD_REGEX)
      .withMessage(userFailedValidation.PASSWORD_MUST_HAVE_CHARACTERS_MESSAGE),
  ];
};
