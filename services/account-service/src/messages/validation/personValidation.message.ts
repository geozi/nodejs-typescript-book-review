/**
 * Person validation error messages.
 * @module src/messages/validation/personValidation.message
 */
import { commonConstants } from "resources/constants/commonConstant";
import { personConstants } from "resources/constants/personConstant";
import {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  NAME_REGEX,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  PHONE_REGEX,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ID_REGEX,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  SSN_REGEX,
} from "resources/regExp/validationRegExp";

/**
 * Contains error messages that are used when person validation fails.
 *
 * @type {object}
 * @property {string} FIRST_NAME_REQUIRED_MESSAGE - Message sent when no first name is provided.
 * @property {string} FIRST_NAME_INVALID_MESSAGE - Message sent when the provided first name does not match the {@link NAME_REGEX}.
 * @property {string} FIRST_NAME_BELOW_MIN_LENGTH_MESSAGE - Message sent when the provided first name is shorter than the accepted minimum length.
 * @property {string} LAST_NAME_REQUIRED_MESSAGE - Message sent when no last name is provided.
 * @property {string} LAST_NAME_INVALID_MESSAGE - Message sent when the provided last name does not match the {@link NAME_REGEX}.
 * @property {string} LAST_NAME_BELOW_MIN_LENGTH_MESSAGE - Message sent when the provided last name is shorter than the accepted minimum length.
 * @property {string} SSN_REQUIRED_MESSAGE - Message sent when no SSN field is provided.
 * @property {string} SSN_INVALID_MESSAGE - Message sent when the provided SSN does not match the {@link SSN_REGEX}.
 * @property {string} PHONE_NUMBER_REQUIRED_MESSAGE - Message sent when no phone number is provided.
 * @property {string} PHONE_NUMBER_INVALID_MESSAGE - Message sent when the provided phone number does not match the {@link PHONE_REGEX}.
 * @property {string} ADDRESS_REQUIRED_MESSAGE - Message sent when no address is provided.
 * @property {string} PERSON_ID_REQUIRED_MESSAGE - Message sent when no person ID is provided for person info update operations.
 * @property {string} PERSON_ID_INVALID_MESSAGE - Message sent when the provided person ID does not match the {@link ID_REGEX}.
 * @property {string} PERSON_ID_OUT_OF_LENGTH_MESSAGE - Message sent when the provided person ID is either longer or shorter than the accepted length.
 */
export const personFailedValidation = {
  /**
   * Message sent when no first name is provided.
   * @type {string}
   */
  FIRST_NAME_REQUIRED_MESSAGE: "First name is a required field",

  /**
   *  Message sent when the provided first name does not match the {@link NAME_REGEX}.
   * @type {string}
   */
  FIRST_NAME_INVALID_MESSAGE: "First name must only contain letters",

  /**
   * Message sent when the provided first name is shorter than the accepted minimum length.
   * @type {string}
   */
  FIRST_NAME_BELOW_MIN_LENGTH_MESSAGE: `First name must be at least ${personConstants.NAME_MIN_LENGTH} characters long`,

  /**
   *  Message sent when no last name is provided.
   * @type {string}
   */
  LAST_NAME_REQUIRED_MESSAGE: "Last name is a required field",

  /**
   * Message sent when the provided last name does not match the {@link NAME_REGEX}.
   * @type {string}
   */
  LAST_NAME_INVALID_MESSAGE: "Last name must only contain letters",

  /**
   * Message sent when the provided last name is shorter than the accepted minimum length.
   * @type {string}
   */
  LAST_NAME_BELOW_MIN_LENGTH_MESSAGE: `Last name must be at least ${personConstants.NAME_MIN_LENGTH} characters long`,

  /**
   * Message sent when no SSN field is provided.
   * @type {string}
   */
  SSN_REQUIRED_MESSAGE: "SSN is a required field",

  /**
   * Message sent when the provided SSN does not match the {@link SSN_REGEX}.
   * @type {string}
   */
  SSN_INVALID_MESSAGE: `SSN must follow the format XXX-XX-XXXX, where X is a digit`,

  /**
   * Message sent when no phone number is provided.
   * @type {string}
   */
  PHONE_NUMBER_REQUIRED_MESSAGE: "Phone number is a required field",

  /**
   * Message sent when the provided phone number does not match the {@link PHONE_REGEX}.
   * @type {string}
   */
  PHONE_NUMBER_INVALID_MESSAGE: `Phone number must only contain digits and/or hyphens`,

  /**
   * Message sent when no address is provided.
   * @type {string}
   */
  ADDRESS_REQUIRED_MESSAGE: "Address is a required field",

  /**
   * Message sent when no person ID is provided for person info update operations.
   * @type {string}
   */
  PERSON_ID_REQUIRED_MESSAGE: "Person ID is a required field",

  /**
   * Message sent when the provided person ID does not match the {@link ID_REGEX}.
   * @type {string}
   */
  PERSON_ID_INVALID_MESSAGE: "Person ID must be a string of hex characters",

  /**
   * Message sent when the provided person ID is either longer or shorter than the accepted length.
   * @type {string}
   */
  PERSON_ID_OUT_OF_LENGTH_MESSAGE: `Person ID must be ${commonConstants.MONGODB_ID_LENGTH} characters long`,
};
