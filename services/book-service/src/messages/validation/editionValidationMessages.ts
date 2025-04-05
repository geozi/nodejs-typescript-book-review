/**
 * Edition validation error messages.
 * @module src/messages/validation/editionValidationMessages
 */
import { editionConstants } from "resources/constants/editionConstants";
import { BookFormat } from "resources/enum/BookFormat";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Edition } from "entities/Edition";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { IEditionUpdate } from "interfaces/IEditionUpdate";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ALPHABETIC_REGEX } from "resources/regexp/validationRegExp";

/**
 * Contains error messages that are used when validation of an {@link Edition} or an {@link IEditionUpdate} object fails.
 *
 * @type {object}
 * @property {string} ISBN_REQUIRED_MESSAGE - Message sent when no ISBN is provided.
 * @property {string} ISBN_INVALID_MESSAGE - Message sent when the provided ISBN does not match the ISBN-13 format.
 * @property {string} PUBLICATION_DATE_REQUIRED_MESSAGE - Message sent when no publication date is provided.
 * @property {string} PUBLICATION_DATE_INVALID_MESSAGE - Message sent when the provided publication date is not a valid date.
 * @property {string} PUBLISHER_REQUIRED_MESSAGE - Message sent when no publisher name is provided.
 * @property {string} PUBLISHER_NOT_STRING_MESSAGE - Message sent when the provided publisher name is not a string.
 * @property {string} PUBLISHER_BELOW_MIN_LENGTH_MESSAGE - Message sent when the provided publisher name is too short.
 * @property {string} PUBLISHER_ABOVE_MAX_LENGTH_MESSAGE - Message sent when the provided publisher name is too long.
 * @property {string} PAGE_COUNT_REQUIRED_MESSAGE - Message sent when no page count is provided.
 * @property {string} PAGE_COUNT_INVALID_MESSAGE - Message sent when the provided page count is not an integer.
 * @property {string} PAGE_COUNT_NEGATIVE_MESSAGE - Message sent when the provided page count is a negative integer.
 * @property {string} PAGE_COUNT_MINIMUM_MESSAGE - Message sent when the provided page count is lower than the accepted minimum.
 * @property {string} BOOK_FORMAT_REQUIRED_MESSAGE - Message sent when no book format is provided.
 * @property {string} BOOK_FORMAT_INVALID_MESSAGE - Message sent when the provided book format is not a {@link BookFormat} enum.
 * @property {string} LANGUAGE_REQUIRED_MESSAGE - Message sent when no book language is provided.
 * @property {string} LANGUAGE_NOT_STRING_MESSAGE - Message sent when the provided book language is not a string.
 * @property {string} LANGUAGE_INVALID_MESSAGE - Message sent when the provided book language does not match the {@link ALPHABETIC_REGEX}.
 * @property {string} LANGUAGE_MIN_LENGTH_MESSAGE - Message sent when the provided book language is too short.
 * @property {string} EDITION_ID_REQUIRED_MESSAGE - Message sent when no edition ID is provided.
 * @property {string} EDITION_ID_INVALID_MESSAGE - Message sent when the provided edition ID is not an integer.
 * @property {string} EDITION_ID_NEGATIVE_MESSAGE - Message sent when the provided edition ID is a negative integer.
 * @property {string} BOOK_REQUIRED_MESSAGE - Message sent when no book details are provided.
 * @property {string} BOOK_ID_REQUIRED_MESSAGE - Message sent when no book ID is provided.
 * @property {string} BOOK_ID_INVALID_MESSAGE - Message sent when the provided book ID is not an integer.
 * @property {string} BOOK_ID_NEGATIVE_MESSAGE - Message sent when the provided book ID is a negative integer.
 */
export const editionFailedValidation = {
  /**
   * Message sent when no ISBN is provided.
   * @type {string}
   */
  ISBN_REQUIRED_MESSAGE: "Isbn is a required field",

  /**
   * Message sent when the provided ISBN does not match the ISBN-13 format.
   * @type {string}
   */
  ISBN_INVALID_MESSAGE: "String must be a valid ISBN-13",

  /**
   * Message sent when no publication date is provided.
   * @type {string}
   */
  PUBLICATION_DATE_REQUIRED_MESSAGE: "Publication date is a required field",

  /**
   * Message sent when the provided publication date is not a valid date.
   * @type {string}
   */
  PUBLICATION_DATE_INVALID_MESSAGE: `Publication date must be a valid date`,

  /**
   * Message sent when no publisher name is provided.
   * @type {string}
   */
  PUBLISHER_REQUIRED_MESSAGE: "Publisher name is a required field",

  /**
   * Message sent when the provided publisher name is not a string.
   * @type {string}
   */
  PUBLISHER_NOT_STRING_MESSAGE: "Publisher field must be a string",

  /**
   * Message sent when the provided publisher name is too short.
   * @type {string}
   */
  PUBLISHER_BELOW_MIN_LENGTH_MESSAGE: `Publisher field must be at least ${editionConstants.PUBLISHER_MIN_LENGTH} characters long`,

  /**
   * Message sent when the provided publisher name is too long.
   * @type {string}
   */
  PUBLISHER_ABOVE_MAX_LENGTH_MESSAGE: `Publisher field must be no longer than ${editionConstants.PUBLISHER_MAX_LENGTH} characters long`,

  /**
   * Message sent when no page count is provided.
   * @type {string}
   */
  PAGE_COUNT_REQUIRED_MESSAGE: "Page count is a required field",

  /**
   * Message sent when the provided page count is not an integer.
   * @type {string}
   */
  PAGE_COUNT_INVALID_MESSAGE: "Page count must be an integer",

  /**
   * Message sent when the provided page count is a negative integer.
   * @type {string}
   */
  PAGE_COUNT_NEGATIVE_MESSAGE: "Page count must be a positive number",

  /**
   * Message sent when the provided page count is lower than the accepted minimum.
   * @type {string}
   */
  PAGE_COUNT_MINIMUM_MESSAGE: `Page count must be at least ${editionConstants.MIN_PAGE_COUNT}`,

  /**
   * Message sent when no book format is provided.
   * @type {string}
   */
  BOOK_FORMAT_REQUIRED_MESSAGE: "Book format is a required field",

  /**
   * Message sent when the provided book format is not a {@link BookFormat} enum.
   * @type{string}
   */
  BOOK_FORMAT_INVALID_MESSAGE: `Book format must be either ${BookFormat.EBOOK} or ${BookFormat.HARDCOVER}`,

  /**
   * Message sent when no book language is provided.
   * @type {string}
   */
  LANGUAGE_REQUIRED_MESSAGE: "Book language is a required field",

  /**
   * Message sent when the provided book language is not a string.
   * @type {string}
   */
  LANGUAGE_NOT_STRING_MESSAGE: "Book language must be a string",

  /**
   * Message sent when the provided book language does not match the {@link ALPHABETIC_REGEX}.
   * @type {string}
   */
  LANGUAGE_INVALID_MESSAGE: "Book language must only contain letters",

  /**
   * Message sent when the provided book language is too short.
   * @type {string}
   */
  LANGUAGE_MIN_LENGTH_MESSAGE: `Book language must be at least ${editionConstants.LANGUAGE_MIN_LENGTH} characters long`,

  /**
   * Message sent when no edition ID is provided.
   * @type {string}
   */
  EDITION_ID_REQUIRED_MESSAGE: "Edition ID is a required field",

  /**
   * Message sent when the provided edition ID is not an integer.
   * @type {string}
   */
  EDITION_ID_INVALID_MESSAGE: "Edition ID must be a number",

  /**
   * Message sent when the provided edition ID is a negative integer.
   * @type {string}
   */
  EDITION_ID_NEGATIVE_MESSAGE: "Edition ID must be a positive integer",

  /**
   * Message sent when no book details are provided.
   * @type {string}
   */
  BOOK_REQUIRED_MESSAGE: "Book is a required field",

  /**
   * Message sent when no book ID is provided.
   * @type {string}
   */
  BOOK_ID_REQUIRED_MESSAGE: "Book ID is a required field",

  /**
   * Message sent when the provided book ID is not an integer.
   * @type {string}
   */
  BOOK_ID_INVALID_MESSAGE: "Book ID must be an integer",

  /**
   * Message sent when the provided book ID is a negative integer.
   * @type {string}
   */
  BOOK_ID_NEGATIVE_MESSAGE: "Book ID must be a positive integer",
};
