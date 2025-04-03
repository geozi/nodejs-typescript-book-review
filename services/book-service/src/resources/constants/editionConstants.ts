/**
 * Edition constants.
 * @module src/resources/constants/editionConstants
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Edition } from "entities/Edition";

/**
 * Contains numeric constants used in the {@link Edition} model entity and express-validator operations.
 *
 * @type {object}
 * @property {number} ISBN_13_LENGTH - The length of an ISBN-13 code.
 * @property {number} PUBLISHER_MIN_LENGTH - The accepted minimum length for a publisher name.
 * @property {number} PUBLISHER_MAX_LENGTH - The accepted maximum length for a publisher name.
 * @property {number} MIN_PAGE_COUNT - The accepted minimum for a book's page count.
 * @property {number} LANGUAGE_MIN_LENGTH - The accepted minimum length for a language.
 */
export const editionConstants = {
  /**
   * The length of an ISBN-13 code.
   * @type {number}
   */
  ISBN_13_LENGTH: 13,

  /**
   * The accepted minimum length for a publisher name.
   * @type {number}
   */
  PUBLISHER_MIN_LENGTH: 2,

  /**
   * The accepted maximum length for a publisher name.
   * @type {number}
   */
  PUBLISHER_MAX_LENGTH: 70,

  /**
   * The accepted minimum for a book's page count.
   * @type {number}
   */
  MIN_PAGE_COUNT: 5,

  /**
   * The accepted minimum length for a language.
   * @type {number}
   */
  LANGUAGE_MIN_LENGTH: 2,
};
