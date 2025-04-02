/**
 * Author validation error messages.
 * @module src/messages/validation/authorValidationMessages
 */
import { authorConstants } from "resources/constants/authorConstants";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ALPHABETIC_REGEX } from "resources/regexp/validationRegExp";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { IAuthorUpdate } from "interfaces/IAuthorUpdate";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Author } from "entities/Author";

/**
 * Contains error messages that are used when validation of an {@link Author} or an {@link IAuthorUpdate} object fails.
 *
 * @type {object}
 * @property {string} FIRST_NAME_REQUIRED_MESSAGE - Message sent when no first name is provided.
 * @property {string} FIRST_NAME_NOT_STRING_MESSAGE - Message sent when the provided first name is not a string.
 * @property {string} FIRST_NAME_INVALID_MESSAGE - Message sent when the provided first name does not match the {@link ALPHABETIC_REGEX}.
 * @property {string} FIRST_NAME_BELOW_MIN_LENGTH_MESSAGE - Message sent when the provided first name is too short.
 * @property {string} LAST_NAME_REQUIRED_MESSAGE - Message sent when no last name is provided.
 * @property {string} LAST_NAME_NOT_STRING_MESSAGE - Message sent when the provided last name is not a string.
 * @property {string} LAST_NAME_INVALID_MESSAGE - Message sent when the provided last name does not match the {@link ALPHABETIC_REGEX}.
 * @property {string} LAST_NAME_BELOW_MIN_LENGTH_MESSAGE - Message sent when the provided last name is too short.
 * @property {string} AUTHOR_ID_REQUIRED_MESSAGE - Message sent when no author ID is provided.
 * @property {string} AUTHOR_ID_INVALID_MESSAGE - Message sent when the provided author ID is not an integer.
 */
export const authorFailedValidation = {
  /**
   * Message sent when no first name is provided.
   * @type {string}
   */
  FIRST_NAME_REQUIRED_MESSAGE: "First name is a required field",

  /**
   * Message sent when the provided first name is not a string.
   * @type {string}
   */
  FIRST_NAME_NOT_STRING_MESSAGE: "First name must be a string",

  /**
   * Message sent when the provided first name does not match the {@link ALPHABETIC_REGEX}.
   * @type {string}
   */
  FIRST_NAME_INVALID_MESSAGE: "First name must only contain letters",

  /**
   * Message sent when the provided first name is too short.
   * @type {string}
   */
  FIRST_NAME_BELOW_MIN_LENGTH_MESSAGE: `First name must be at least ${authorConstants.NAME_MIN_LENGTH} characters long`,

  /**
   * Message sent when no last name is provided.
   * @type {string}
   */
  LAST_NAME_REQUIRED_MESSAGE: "Last name is a required field",

  /**
   * Message sent when the provided last name is not a string.
   * @type {string}
   */
  LAST_NAME_NOT_STRING_MESSAGE: "Last name must be a string",

  /**
   * Message sent when the provided last name does not match the {@link ALPHABETIC_REGEX}.
   * @type {string}
   */
  LAST_NAME_INVALID_MESSAGE: "Last name must only contain letters",

  /**
   * Message sent when the provided last name is too short.
   * @type {string}
   */
  LAST_NAME_BELOW_MIN_LENGTH_MESSAGE: `Last name must be at least ${authorConstants.NAME_MIN_LENGTH} characters long`,

  /**
   * Message sent when no author ID is provided.
   * @type {string}
   */
  AUTHOR_ID_REQUIRED_MESSAGE: "Author ID is a required field",

  /**
   * Message sent when the provided author ID is not a valid number.
   * @type {string}
   */
  AUTHOR_ID_INVALID_MESSAGE: "Author ID must be number",
};
