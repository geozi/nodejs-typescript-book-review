/**
 * Book validation error messages.
 * @module src/messages/validation/bookValidationMessages
 */
import { bookConstants } from "resources/constants/bookConstants";
import { Genre } from "resources/enum/Genre";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Book } from "entities/Book";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { IBookUpdate } from "interfaces/IBookUpdate";

/**
 * Contains error messages that are used when validation of a {@link Book} or an {@link IBookUpdate} object fails.
 *
 * @type {object}
 * @property {string} TITLE_REQUIRED_MESSAGE - Message sent when no title is provided.
 * @property {string} TITLE_NOT_STRING_MESSAGE - Message sent when the provided title is not a string.
 * @property {string} TITLE_BELOW_MIN_LENGTH_MESSAGE - Message sent when the provided title is too short.
 * @property {string} TITLE_ABOVE_MAX_LENGTH_MESSAGE - Message sent when the provided title is too long.
 * @property {string} GENRE_REQUIRED_MESSAGE - Message sent when no genre is provided.
 * @property {string} GENRE_INVALID_MESSAGE - Message sent when the provided genre is not a {@link Genre} enum.
 * @property {string} BOOK_ID_REQUIRED_MESSAGE - Message sent when no book ID is provided.
 * @property {string} BOOK_ID_INVALID_MESSAGE - Message sent when the provided book ID is not an integer.
 */
export const bookFailedValidation = {
  /**
   * Message sent when no title is provided.
   * @type {string}
   */
  TITLE_REQUIRED_MESSAGE: "Title is a required field",

  /**
   * Message sent when the provided title is not a string.
   * @type {string}
   */
  TITLE_NOT_STRING_MESSAGE: "Title field must be a string",

  /**
   * Message sent when the provided title is too short.
   * @type {string}
   */
  TITLE_BELOW_MIN_LENGTH_MESSAGE: `Title field must be at least ${bookConstants.TITLE_MIN_LENGTH} characters long`,

  /**
   * Message sent when the provided title is too long.
   * @type {string}
   */
  TITLE_ABOVE_MAX_LENGTH_MESSAGE: `Title field must be no longer than ${bookConstants.TITLE_MAX_LENGTH} characters long`,

  /**
   * Message sent when no genre is provided.
   * @type {string}
   */
  GENRE_REQUIRED_MESSAGE: "Genre is a required field",

  /**
   * Message sent when the provided genre is not a {@link Genre} enum.
   * @type {string}
   */
  GENRE_INVALID_MESSAGE: `Genre field must be one of the following: ${Genre.DRAMA}, ${Genre.FICTION}, ${Genre.NON_FICTION}, ${Genre.POETRY}`,

  /**
   * Message sent when no book ID is provided.
   * @type {string}
   */
  BOOK_ID_REQUIRED_MESSAGE: "Book ID is a required field",

  /**
   * Message sent when the provided book ID is not an integer.
   * @type {string}
   */
  BOOK_ID_INVALID_MESSAGE: "Book ID must be a number",
};
