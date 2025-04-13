/**
 * IReviewUpdate interface.
 * @module src/interfaces/secondary/IReviewUpdate
 */
import { Types } from "mongoose";

/**
 * Represents a data object used for review updates.
 *
 * @interface
 * @property {Types.ObjectId} id - The ID of a review.
 * @property {string} [subject] - (Optional) The subject of a review.
 * @property {string} [description] - (Optional) The description of a review.
 * @property {object} [book] - (Optional) The book under review.
 * @property {number} [book.id] - The ID of the book under review.
 */
export interface IReviewUpdate {
  /**
   * The ID of a review.
   * @type {Types.ObjectId}
   */
  id: Types.ObjectId;

  /**
   * (Optional) The subject of a review.
   * @type {string}
   */
  subject?: string;

  /**
   * (Optional) The description of a review.
   * @type {string}
   */
  description?: string;

  /**
   * (Optional) The book under review.
   * @type {object}
   */
  book?: {
    /**
     * The ID of the book under review.
     * @type {number}
     */
    id: number;
  };
}
