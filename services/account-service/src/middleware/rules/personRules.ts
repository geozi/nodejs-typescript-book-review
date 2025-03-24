/**
 * Express validation rules for personal info addition and update.
 * @module src/middleware/rules/personRules
 */
import { body, check, ValidationChain } from "express-validator";
import { addressFailedValidation } from "messages/validation/addressValidationMessages";
import { personFailedValidation } from "messages/validation/personValidationMessages";
import { addressConstants } from "resources/constants/address.constant";
import { commonConstants } from "resources/constants/common.constant";
import { personConstants } from "resources/constants/person.constant";
import {
  CITY_REGEX,
  ID_REGEX,
  NAME_REGEX,
  PHONE_REGEX,
  SSN_REGEX,
} from "resources/regExp/validationRegExp";

/**
 * Returns a validation chain for personal info addition.
 * @returns {ValidationChain[]} Validation chain.
 */
export const personInfoAdditionRules = (): ValidationChain[] => {
  return [
    check("firstName")
      .notEmpty()
      .withMessage(personFailedValidation.FIRST_NAME_REQUIRED_MESSAGE)
      .bail()
      .isLength({ min: personConstants.NAME_MIN_LENGTH })
      .withMessage(personFailedValidation.FIRST_NAME_BELOW_MIN_LENGTH_MESSAGE)
      .matches(NAME_REGEX)
      .withMessage(personFailedValidation.FIRST_NAME_INVALID_MESSAGE),
    check("lastName")
      .notEmpty()
      .withMessage(personFailedValidation.LAST_NAME_REQUIRED_MESSAGE)
      .bail()
      .isLength({ min: personConstants.NAME_MIN_LENGTH })
      .withMessage(personFailedValidation.LAST_NAME_BELOW_MIN_LENGTH_MESSAGE)
      .matches(NAME_REGEX)
      .withMessage(personFailedValidation.LAST_NAME_INVALID_MESSAGE),
    check("ssn")
      .notEmpty()
      .withMessage(personFailedValidation.SSN_REQUIRED_MESSAGE)
      .bail()
      .matches(SSN_REGEX)
      .withMessage(personFailedValidation.SSN_INVALID_MESSAGE),
    check("phoneNumber")
      .notEmpty()
      .withMessage(personFailedValidation.PHONE_NUMBER_REQUIRED_MESSAGE)
      .bail()
      .matches(PHONE_REGEX)
      .withMessage(personFailedValidation.PHONE_NUMBER_INVALID_MESSAGE),
    check("address")
      .notEmpty()
      .withMessage(personFailedValidation.ADDRESS_REQUIRED_MESSAGE)
      .bail(),
    check("address.streetName")
      .if(body("address").exists())
      .notEmpty()
      .withMessage(addressFailedValidation.STREET_NAME_REQUIRED_MESSAGE)
      .bail()
      .isLength({ min: addressConstants.STREET_NAME_MIN_LENGTH })
      .withMessage(
        addressFailedValidation.STREET_NAME_BELOW_MIN_LENGTH_MESSAGE
      ),
    check("address.residenceNumber")
      .if(body("address").exists())
      .notEmpty()
      .withMessage(addressFailedValidation.RESIDENCE_NUMBER_REQUIRED_MESSAGE)
      .bail()
      .isNumeric()
      .withMessage(addressFailedValidation.RESIDENCE_NUMBER_INVALID_MESSAGE)
      .custom(async (value) => {
        if (value < 0) {
          throw new Error(
            addressFailedValidation.RESIDENCE_NUMBER_NEGATIVE_MESSAGE
          );
        }
      }),
    check("address.zipCode")
      .if(body("address").exists())
      .optional()
      .isLength({
        min: addressConstants.ZIP_CODE_LENGTH,
        max: addressConstants.ZIP_CODE_LENGTH,
      })
      .withMessage(addressFailedValidation.ZIP_CODE_OUT_OF_LENGTH_MESSAGE)
      .isNumeric()
      .withMessage(addressFailedValidation.ZIP_CODE_INVALID_MESSAGE),
    check("address.city")
      .if(body("address").exists())
      .notEmpty()
      .withMessage(addressFailedValidation.CITY_REQUIRED_MESSAGE)
      .bail()
      .matches(CITY_REGEX)
      .withMessage(addressFailedValidation.CITY_INVALID_MESSAGE),
  ];
};

/**
 * Returns a validation chain for personal info update.
 * @returns {ValidationChain[]} Validation chain.
 */
export const personInfoUpdateRules = (): ValidationChain[] => {
  return [
    check("id")
      .notEmpty()
      .withMessage(personFailedValidation.PERSON_ID_REQUIRED_MESSAGE)
      .bail()
      .isLength({
        min: commonConstants.MONGODB_ID_LENGTH,
        max: commonConstants.MONGODB_ID_LENGTH,
      })
      .withMessage(personFailedValidation.PERSON_ID_OUT_OF_LENGTH_MESSAGE)
      .matches(ID_REGEX)
      .withMessage(personFailedValidation.PERSON_ID_INVALID_MESSAGE),
    check("firstName")
      .optional()
      .isLength({ min: personConstants.NAME_MIN_LENGTH })
      .withMessage(personFailedValidation.FIRST_NAME_BELOW_MIN_LENGTH_MESSAGE)
      .matches(NAME_REGEX)
      .withMessage(personFailedValidation.FIRST_NAME_INVALID_MESSAGE),
    check("lastName")
      .optional()
      .isLength({ min: personConstants.NAME_MIN_LENGTH })
      .withMessage(personFailedValidation.LAST_NAME_BELOW_MIN_LENGTH_MESSAGE)
      .matches(NAME_REGEX)
      .withMessage(personFailedValidation.LAST_NAME_INVALID_MESSAGE),
    check("ssn")
      .optional()
      .matches(SSN_REGEX)
      .withMessage(personFailedValidation.SSN_INVALID_MESSAGE),
    check("phoneNumber")
      .optional()
      .matches(PHONE_REGEX)
      .withMessage(personFailedValidation.PHONE_NUMBER_INVALID_MESSAGE),
    check("address").optional(),
    check("address.streetName")
      .if(body("address").exists())
      .optional()
      .isLength({ min: addressConstants.STREET_NAME_MIN_LENGTH })
      .withMessage(
        addressFailedValidation.STREET_NAME_BELOW_MIN_LENGTH_MESSAGE
      ),
    check("address.residenceNumber")
      .if(body("address").exists())
      .optional()
      .isNumeric()
      .withMessage(addressFailedValidation.RESIDENCE_NUMBER_INVALID_MESSAGE)
      .custom(async (value) => {
        if (value < 0) {
          throw new Error(
            addressFailedValidation.RESIDENCE_NUMBER_NEGATIVE_MESSAGE
          );
        }
      }),
    check("address.zipCode")
      .if(body("address").exists())
      .optional()
      .isLength({
        min: addressConstants.ZIP_CODE_LENGTH,
        max: addressConstants.ZIP_CODE_LENGTH,
      })
      .withMessage(addressFailedValidation.ZIP_CODE_OUT_OF_LENGTH_MESSAGE)
      .isNumeric()
      .withMessage(addressFailedValidation.ZIP_CODE_INVALID_MESSAGE),
    check("address.city")
      .if(body("address").exists())
      .optional()
      .matches(CITY_REGEX)
      .withMessage(addressFailedValidation.CITY_INVALID_MESSAGE),
  ];
};
