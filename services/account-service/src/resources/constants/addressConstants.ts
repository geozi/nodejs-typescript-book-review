/**
 * Address constants.
 * @module src/resources/constants/addressConstants
 */

/**
 * Contains numeric constants used in express-validator operations.
 *
 * @type {object}
 * @property {number} STREET_NAME_MIN_LENGTH - The minimum length accepted for a street name.
 * @property {number} ZIP_CODE_LENGTH - The accepted length for a zip code.
 */
export const addressConstants = {
  /**
   * The minimum length accepted for a street name.
   * @type {number}
   */
  STREET_NAME_MIN_LENGTH: 10,

  /**
   * The accepted length for a zip code.
   * @type {number}
   */
  ZIP_CODE_LENGTH: 5,
};
