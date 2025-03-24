/**
 * User validation error messages.
 * @module src/messages/validation/userValidationMessages
 */
import { userConstants } from "resources/constants/userConstants";
import { RoleType } from "resources/enums/roleType.enum";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { EMAIL_REGEX, PASSWORD_REGEX } from "resources/regExp/validationRegExp";

/**
 * Contains error message(s) that are used when user validation fails.
 *
 * @type {object}
 * @property {string} USERNAME_REQUIRED_MESSAGE - Message sent when no username is provided.
 * @property {string} USERNAME_ABOVE_MAX_LENGTH_MESSAGE - Message sent when the provided username is longer than the accepted maximum length.
 * @property {string} USERNAME_BELOW_MIN_LENGTH_MESSAGE - Message sent when the provided username is shorter than the accepted minimum length.
 * @property {string} EMAIL_REQUIRED_MESSAGE - Message sent when no email is provided.
 * @property {string} EMAIL_INVALID_MESSAGE - Message sent when the provided email does not match the {@link EMAIL_REGEX}.
 * @property {string} PASSWORD_REQUIRED_MESSAGE - Message sent when no password is provided.
 * @property {string} PASSWORD_BELOW_MIN_LENGTH_MESSAGE - Message sent when the provided password is shorter than the accepted minimum length.
 * @property {string} PASSWORD_MUST_HAVE_CHARACTERS_MESSAGE - Message sent when the provided password does not match the {@link PASSWORD_REGEX}.
 * @property {string} ROLE_REQUIRED_MESSAGE - Message sent when no role is provided.
 * @property {string} ROLE_INVALID_MESSAGE - Message sent when the provided role does not comply with the {@link RoleType} enums.
 */
export const userFailedValidation = {
  /**
   * Message sent when no username is provided.
   * @type {string}
   */
  USERNAME_REQUIRED_MESSAGE: "Username is a required field",

  /**
   * Message sent when the provided username is longer than the accepted maximum length.
   * @type {string}
   */
  USERNAME_ABOVE_MAX_LENGTH_MESSAGE: `Username must be no longer than ${userConstants.USERNAME_MAX_LENGTH} characters`,

  /**
   * Message sent when the provided username is shorter than the accepted minimum length.
   * @type {string}
   */
  USERNAME_BELOW_MIN_LENGTH_MESSAGE: `Username must be at least ${userConstants.USERNAME_MIN_LENGTH} characters long`,

  /**
   * Message sent when no email is provided.
   * @type {string}
   */
  EMAIL_REQUIRED_MESSAGE: "Email is a required field",

  /**
   * Message sent when the provided email does not match the {@link EMAIL_REGEX}.
   * @type {string}
   */
  EMAIL_INVALID_MESSAGE: "User email is not valid",

  /**
   * Message sent when no password is provided.
   * @type {string}
   */
  PASSWORD_REQUIRED_MESSAGE: "Password is a required field",

  /**
   * Message sent when the provided password is shorter than the accepted minimum length.
   * @type {string}
   */
  PASSWORD_BELOW_MIN_LENGTH_MESSAGE: `Password must be at least ${userConstants.PASSWORD_MIN_LENGTH} characters long`,

  /**
   * Message sent when the provided password does not match the {@link PASSWORD_REGEX}.
   * @type {string}
   */
  PASSWORD_MUST_HAVE_CHARACTERS_MESSAGE: `Password must have at least: one lowercase character, one uppercase character, one number, and one special symbol`,

  /**
   * Message sent when no role is provided.
   * @type {string}
   */
  ROLE_REQUIRED_MESSAGE: "Role is a required field",

  /**
   * Message sent when the provided role does not comply with the {@link RoleType} enums.
   * @type {string}
   */
  ROLE_INVALID_MESSAGE: `Role must be either one of the following: ${RoleType.Admin}, ${RoleType.User}`,
};
