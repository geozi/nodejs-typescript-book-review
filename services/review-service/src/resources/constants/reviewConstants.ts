/**
 * Review constants.
 * @module src/resources/constants/reviewConstants
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Review } from "models/Review";

/**
 * Contains numeric constants used in the {@link Review} model entity and express-validator operations.
 *
 * @type {object}
 * @property {number} SUBJECT_MIN_LENGTH - The accepted minimum length for a review subject.
 * @property {number} SUBJECT_MAX_LENGTH - The accepted maximum length for a review subject.
 * @property {number} DESCRIPTION_MIN_LENGTH - The accepted minimum length for a review description.
 * @property {number} DESCRIPTION_MAX_LENGTH - The accepted maximum length for a review description.
 */
export const reviewConstants = {
  /**
   * The accepted minimum length for a review subject.
   * @type {number}
   */
  SUBJECT_MIN_LENGTH: 5,

  /**
   * The accepted maximum length for a review subject.
   * @type {number}
   */
  SUBJECT_MAX_LENGTH: 100,

  /**
   * The accepted minimum length for a review description.
   * @type {number}
   */
  DESCRIPTION_MIN_LENGTH: 10,

  /**
   * The accepted maximum length for a review description.
   * @type {number}
   */
  DESCRIPTION_MAX_LENGTH: 300,
};
