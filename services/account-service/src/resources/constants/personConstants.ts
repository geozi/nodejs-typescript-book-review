/**
 * Person constants.
 * @module src/resources/constants/personConstants
 */

/**
 * Contains numeric constants used in the person model and in express-validator operations.
 *
 * @type {object}
 * @property {number} NAME_MIN_LENGTH - The minimum length accepted for a first name and a last name.
 * @property {number} SSN_LENGTH - The accepted length for a social security number.
 */
export const personConstants = {
  /**
   * The minimum length accepted for a first name and a last name.
   * @type {number}
   */
  NAME_MIN_LENGTH: 2,

  /**
   * The accepted length for a social security number.
   * @type {number}
   */
  SSN_LENGTH: 11,
};
