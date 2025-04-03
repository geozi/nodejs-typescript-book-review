/**
 * Book constants.
 * @module src/resources/constants/bookConstants
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Book } from "entities/Book";

/**
 * Contains numeric constants used in the {@link Book} model entity and express-validator operations.
 *
 * @type {object}
 * @property {number} TITLE_MIN_LENGTH - The accepted minimum length for a book title.
 * @property {number} TITLE_MAX_LENGTH - The accepted maximum length for a book title.
 */
export const bookConstants = {
  /**
   * The accepted minimum length for a book title.
   * @type {number}
   */
  TITLE_MIN_LENGTH: 2,

  /**
   * The accepted maximum length for a book title.
   * @type {number}
   */
  TITLE_MAX_LENGTH: 100,
};
