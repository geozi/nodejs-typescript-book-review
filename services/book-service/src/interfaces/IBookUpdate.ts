/**
 * IBookUpdate interface.
 * @module src/interfaces/IBookUpdate
 */
import { Genre } from "resources/enum/Genre";

/**
 * Represents a data object used to update the
 * information of a book.
 *
 * @interface
 * @property {string} [title] - (Optional) The title of a book.
 * @property {Genre} [genre] - (Optional) The genre of a book. See {@link Genre}.
 */
export interface IBookUpdate {
  /**
   * (Optional) The title of a book.
   * @type {string}
   */
  title?: string;

  /**
   * (Optional) The genre of a book. See {@link Genre}.
   * @type {Genre}
   */
  genre?: Genre;
}
