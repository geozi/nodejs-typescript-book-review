/**
 * IAuthorUpdate interface.
 * @module src/interfaces/IAuthorUpdate
 */

/**
 * Represents a data object used to update the
 * information of an author.
 *
 * @interface
 * @property {string} [firstName] - (Optional) The first name of an author.
 * @property {string} [lastName] - (Optional) The last name of an author.
 */
export interface IAuthorUpdate {
  /**
   * (Optional) The first name of an author.
   * @type {string}
   */
  firstName?: string;

  /**
   * (Optional) The last name of an author.
   * @type {string}
   */
  lastName?: string;
}
