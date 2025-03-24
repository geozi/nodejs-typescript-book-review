/**
 * Express validation rules for user authentication.
 * @module src/auth/authRules
 */
import { check, ValidationChain } from "express-validator";
import { userFailedValidation } from "messages/validation/userValidationMessages";
import { userConstants } from "resources/constants/user.constant";
import { PASSWORD_REGEX } from "resources/regExp/validationRegExp";

/**
 * Returns a validation chain for user login.
 * @returns {ValidationChain[]} Validation chain.
 */
export const userLoginRules = (): ValidationChain[] => {
  return [
    check("username")
      .notEmpty()
      .withMessage(userFailedValidation.USERNAME_REQUIRED_MESSAGE)
      .bail()
      .isLength({ min: userConstants.USERNAME_MIN_LENGTH })
      .withMessage(userFailedValidation.USERNAME_BELOW_MIN_LENGTH_MESSAGE)
      .isLength({ max: userConstants.USERNAME_MAX_LENGTH })
      .withMessage(userFailedValidation.USERNAME_ABOVE_MAX_LENGTH_MESSAGE),
    check("password")
      .notEmpty()
      .withMessage(userFailedValidation.PASSWORD_REQUIRED_MESSAGE)
      .bail()
      .isLength({ min: userConstants.PASSWORD_MIN_LENGTH })
      .withMessage(userFailedValidation.PASSWORD_BELOW_MIN_LENGTH_MESSAGE)
      .matches(PASSWORD_REGEX)
      .withMessage(userFailedValidation.PASSWORD_MUST_HAVE_CHARACTERS_MESSAGE),
  ];
};
