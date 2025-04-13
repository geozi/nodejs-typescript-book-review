/**
 * IReview interface.
 * @module src/interfaces/documents/IReview
 */
import { Document } from "mongoose";

/**
 * Represents a review added by a user.
 *
 * @interface
 * @extends {Document}
 * @property {string} subject - The subject of a review.
 * @property {string} description - The description of a review.
 * @property {object} book - The book under review.
 * @property {number} book.id - The ID of the book under review.
 * @property {string} username - The username of the user adding the review.
 */
export interface IReview extends Document {
  /**
   * The subject of a review.
   * @type {string}
   */
  subject: string;

  /**
   * The description of a review.
   * @type {string}
   */
  description: string;

  /**
   * The book under review.
   * @type {object}
   */
  book: {
    /**
     * The ID of the book under review.
     * @type {number}
     */
    id: number;
  };

  /**
   *  The username of the user adding the review.
   * @type {string}
   */
  username: string;
}
