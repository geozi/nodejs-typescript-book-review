/**
 * IEditionUpdate interface.
 * @module src/interfaces/IEditionUpdate
 */
import { Book } from "entities/Book";
import { BookFormat } from "resources/enum/BookFormat";

/**
 * Represents a data object used to update the
 * information of a book edition.
 *
 * @interface
 * @property {string} [isbn] - (Optional) The ISBN of a book edition.
 * @property {Date} [publicationDate] - (Optional) The publication date of a book edition.
 * @property {string} [publisher] - (Optional) The name of the publisher.
 * @property {number} [pageCount] - (Optional) The page count of a book.
 * @property {BookFormat} [bookFormat] - (Optional) The book format. See {@link BookFormat}.
 * @property {string} [bookLanguage] - (Optional) The language of a book.
 * @property {Book} [book] - (Optional) A {@link Book} object containing the book ID connected to a particular edition.
 */
export interface IEditionUpdate {
  /**
   * (Optional) The ISBN of a book edition.
   * @type {string}
   */
  isbn?: string;

  /**
   * (Optional) The publication date of a book edition.
   * @type {Date}
   */
  publicationDate?: Date;

  /**
   * (Optional) The name of the publisher.
   * @type {string}
   */
  publisher?: string;

  /**
   * (Optional) The page count of a book.
   * @type {number}
   */
  pageCount?: number;

  /**
   * (Optional) The book format. See {@link BookFormat}.
   * @type {BookFormat}
   */
  bookFormat?: BookFormat;

  /**
   * (Optional) The language of a book.
   * @type {string}
   */
  bookLanguage?: string;

  /**
   * (Optional) A {@link Book} object containing the book ID connected to a particular edition.
   * @type {Book}
   */
  book?: Book;
}
