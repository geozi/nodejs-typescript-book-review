/**
 * Author constants.
 * @module src/resources/constants/authorConstants
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Author } from "entities/Author";

/**
 * Contains numeric constants used in the {@link Author} model entity and express-validator operations.
 *
 * @type {object}
 * @property {number} NAME_MIN_LENGTH - The accepted minimum length for an author's first and last names.
 */
export const authorConstants = {
  /**
   * The accepted minimum length for an author's first and last names.
   * @type {number}
   */
  NAME_MIN_LENGTH: 2,
};
