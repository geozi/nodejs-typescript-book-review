/**
 * ICompositeIndex interface.
 * @module src/interfaces/secondary/ICompositeIndex
 */

/**
 * Represents a composite index.
 *
 * @interface
 * @property {string} subject - The subject of a review.
 * @property {string} username - The username of the user adding the review.
 */
export interface ICompositeIndex {
  /**
   * The subject of a review.
   * @type {string}
   */
  subject: string;

  /**
   * The username of the user adding the review.
   * @type {string}
   */
  username: string;
}
