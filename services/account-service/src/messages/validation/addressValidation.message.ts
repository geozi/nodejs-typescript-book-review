/**
 * Address validation error messages.
 * @module src/messages/validation/addressValidation.message
 */
import { addressConstants } from "resources/constants/address.constant";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { CITY_REGEX } from "resources/regExp/validationRegExp";

/**
 * Contains error messages that are used when address validation fails.
 *
 * @type {object}
 * @property {string} STREET_NAME_REQUIRED_MESSAGE - Message sent when no street name is provided.
 * @property {string} STREET_NAME_MIN_LENGTH - Message sent when the provided street name is shorter than the accepted minimum length.
 * @property {string} RESIDENCE_NUMBER_REQUIRED_MESSAGE - Message sent when no residence number is provided.
 * @property {string} RESIDENCE_NUMBER_INVALID_MESSAGE - Message sent when the provided residence number is not a number.
 * @property {string} RESIDENCE_NUMBER_NEGATIVE_MESSAGE - Message sent when the provided residence number is negative.
 * @property  {string} ZIP_CODE_OUT_OF_LENGTH_MESSAGE - Message sent when the provided zip code is either shorter or longer than the accepted length.
 * @property {string} ZIP_CODE_INVALID_MESSAGE - Message sent when the provided zip code is not a number.
 * @property {string} CITY_REQUIRED_MESSAGE - Message sent when no city is provided.
 * @property {string} CITY_INVALID_MESSAGE - Message sent when the provided city does not match the {@link CITY_REGEX}.
 */
export const addressFailedValidation = {
  /**
   * Message sent when no street name is provided.
   * @type {string}
   */
  STREET_NAME_REQUIRED_MESSAGE: "Street name is a required field",

  /**
   * Message sent when the provided street name is shorter than the accepted minimum length.
   * @type {string}
   */
  STREET_NAME_BELOW_MIN_LENGTH_MESSAGE: `Street name must be at least ${addressConstants.STREET_NAME_MIN_LENGTH} characters long`,

  /**
   * Message sent when no residence number is provided.
   * @type {string}
   */
  RESIDENCE_NUMBER_REQUIRED_MESSAGE: "Residence number is a required field",

  /**
   * Message sent when the provided residence number is not a number.
   * @type {string}
   */
  RESIDENCE_NUMBER_INVALID_MESSAGE: "Residence number must be a number",

  /**
   * Message sent when the provided residence number is negative.
   * @type {string}
   */
  RESIDENCE_NUMBER_NEGATIVE_MESSAGE: `Residence number must be a positive number`,

  /**
   * Message sent when the provided zip code is either shorter or longer than the accepted length.
   * @type {string}
   */
  ZIP_CODE_OUT_OF_LENGTH_MESSAGE: `Zip code must be ${addressConstants.ZIP_CODE_LENGTH} characters long`,

  /**
   * Message sent when the provided zip code is not a number.
   * @type {string}
   */
  ZIP_CODE_INVALID_MESSAGE: "Zip code must only contain digits",

  /**
   * Message sent when no city is provided.
   * @type {string}
   */
  CITY_REQUIRED_MESSAGE: "City is a required field",

  /**
   * Message sent when the provided city does not match the {@link CITY_REGEX}.
   * @type {string}
   */
  CITY_INVALID_MESSAGE: `City must only contain letters and/or white spaces and/or hyphens`,
};
