/**
 * Review validation error messages.
 * @module src/messages/validation/reviewValidationMessages
 */
import { reviewConstants } from "resources/constants/reviewConstants";

/**
 * Contains error messages that are used when review validation fails.
 *
 * @type {object}
 * @property {string} SUBJECT_REQUIRED_MESSAGE - Message sent when no subject is provided.
 * @property {string} SUBJECT_BELOW_MIN_LENGTH_MESSAGE - Message sent when the provided subject is too short.
 * @property {string} SUBJECT_ABOVE_MAX_LENGTH_MESSAGE - Message sent when the provided subject is too long.
 * @property {string} DESCRIPTION_REQUIRED_MESSAGE - Message sent when no description is provided.
 * @property {string} DESCRIPTION_BELOW_MIN_LENGTH_MESSAGE - Message sent when the provided description is too short.
 * @property {string} DESCRIPTION_ABOVE_MAX_LENGTH_MESSAGE - Message sent when the provided description is too long.
 * @property {string} BOOK_REQUIRED_MESSAGE - Message sent when no book is provided.
 * @property {string} BOOK_ID_REQUIRED_MESSAGE - Message sent when no book ID is provided.
 * @property {string} BOOK_ID_INVALID_MESSAGE - Message sent when the provided book ID is not a valid integer.
 * @property {string} BOOK_ID_NEGATIVE_MESSAGE - Message sent when the provided book ID is a negative integer.
 * @property {string} USERNAME_REQUIRED_MESSAGE - Message sent when no username is provided.
 * @property {string} REVIEW_ID_REQUIRED_MESSAGE - Message sent when no review ID is provided.
 * @property {string} REVIEW_ID_INVALID_MESSAGE - Message sent when the provided review ID is not a 24-character hex string.
 */
export const reviewFailedValidation = {
  /**
   * Message sent when no subject is provided.
   * @type {string}
   */
  SUBJECT_REQUIRED_MESSAGE: "Title is a required field",

  /**
   * Message sent when the provided subject is too short.
   * @type {string}
   */
  SUBJECT_BELOW_MIN_LENGTH_MESSAGE: `Title must be at least ${reviewConstants.SUBJECT_MIN_LENGTH} characters long`,

  /**
   * Message sent when the provided subject is too long.
   * @type {string}
   */
  SUBJECT_ABOVE_MAX_LENGTH_MESSAGE: `Title must be no longer than ${reviewConstants.SUBJECT_MAX_LENGTH} characters long`,

  /**
   * Message sent when no description is provided.
   * @type {string}
   */
  DESCRIPTION_REQUIRED_MESSAGE: "Description is a required field",

  /**
   * Message sent when the provided description is too short.
   * @type {string}
   */
  DESCRIPTION_BELOW_MIN_LENGTH_MESSAGE: `Description must be at least ${reviewConstants.DESCRIPTION_MIN_LENGTH} characters long`,

  /**
   * Message sent when the provided description is too long.
   * @type {string}
   */
  DESCRIPTION_ABOVE_MAX_LENGTH_MESSAGE: `Description must be no longer than ${reviewConstants.DESCRIPTION_MAX_LENGTH} characters long`,

  /**
   * Message sent when no book is provided.
   * @type {string}
   */
  BOOK_REQUIRED_MESSAGE: "Book is a required field",

  /**
   * Message sent when no book ID is provided.
   * @type {string}
   */
  BOOK_ID_REQUIRED_MESSAGE: "Book ID is a required field",

  /**
   * Message sent when the provided book ID is not a valid integer.
   * @type {string}
   */
  BOOK_ID_INVALID_MESSAGE: "Book ID must be an integer",

  /**
   * Message sent when the provided book ID is a negative integer.
   * @type {string}
   */
  BOOK_ID_NEGATIVE_MESSAGE: "Book ID must be a positive integer",

  /**
   * Message sent when no username is provided.
   * @type {string}
   */
  USERNAME_REQUIRED_MESSAGE: "Username is a required field",

  /**
   * Message sent when no review ID is provided.
   * @type {string}
   */
  REVIEW_ID_REQUIRED_MESSAGE: "Review ID is a required field",

  /**
   * Message sent when the provided review ID is not a 24-character hex string.
   * @type {string}
   */
  REVIEW_ID_INVALID_MESSAGE: `Review ID must be a 24-character hex string`,
};
