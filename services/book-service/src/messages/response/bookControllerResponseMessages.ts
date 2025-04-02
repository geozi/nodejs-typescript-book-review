/**
 * Book controller HTTP response messages.
 * @module src/messages/response/bookControllerResponseMessages
 */

/**
 * Contains HTTP response messages sent by the book controller.
 *
 * @type {object}
 * @property {string} BOOK_ADDED - Message sent when the information of a new book is successfully added to database.
 * @property {string} BOOK_UPDATED - Message sent when the information of a book is successfully updated.
 * @property {string} BOOK_NOT_FOUND - Message sent when the information of a book is not found in the database.
 * @property {string} BOOK_S_NOT_FOUND - Message sent when the information of multiple books is not found in the database.
 * @property {string} BOOK_RETRIEVED - Message sent when the information of a book is found and successfully retrieved from database.
 * @property {string} BOOK_S_RETRIEVED - Message sent when the information of multiple books is found and successfully retrieved from database.
 */
export const bookControllerResponseMessages = {
  /**
   * Message sent when the information of a new book is successfully added to database.
   * @type {string}
   */
  BOOK_ADDED: "Successful book addition",

  /**
   * Message sent when the information of a book is successfully updated.
   * @type {string}
   */
  BOOK_UPDATED: "Successful book update",

  /**
   * Message sent when the information of a book is not found in the database.
   * @type {string}
   */
  BOOK_NOT_FOUND: "Book was not found",

  /**
   * Message sent when the information of multiple books is not found in the database.
   * @type {string}
   */
  BOOK_S_NOT_FOUND: "Books were not found",

  /**
   * Message sent when the information of a book is found and successfully retrieved from database.
   * @type {string}
   */
  BOOK_RETRIEVED: "Successful book retrieval",

  /**
   * Message sent when the information of multiple books is found and successfully retrieved from database.
   * @type {string}
   */
  BOOK_S_RETRIEVED: "Successful retrieval of books",
};
