/**
 * User constants.
 * @module src/resources/constants/user.constant
 */

/**
 * Contains numeric constants used in the user model, person model, and in express-validator operations.
 *
 * @type {object}
 * @property {number} USERNAME_MAX_LENGTH - The maximum length accepted for a username.
 * @property {number} USERNAME_MIN_LENGTH - The minimum length accepted for a username.
 * @property {number} PASSWORD_MIN_LENGTH - The minimum length accepted for a password.
 */
export const userConstants = {
  /**
   * The maximum length accepted for a username.
   * @type {number}
   */
  USERNAME_MAX_LENGTH: 20,

  /**
   * The minimum length accepted for a username.
   * @type {number}
   */
  USERNAME_MIN_LENGTH: 3,

  /**
   * The minimum length accepted for a password.
   * @type {number}
   */
  PASSWORD_MIN_LENGTH: 7,
};
