/**
 * Book controller HTTP response messages.
 * @module src/messages/response/bookControllerResponseMessages
 */

/**
 * Contains HTTP response messages sent by the book controller.
 *
 * @type {object}
 * @property {string} BOOK_ADDED_MESSAGE - Message sent when the information of a new book is successfully added to database.
 * @property {string} BOOK_UPDATED_MESSAGE - Message sent when the information of a book is successfully updated.
 * @property {string} BOOK_NOT_FOUND_MESSAGE - Message sent when the information of a book is not found in the database.
 * @property {string} BOOK_S_NOT_FOUND_MESSAGE - Message sent when the information of multiple books is not found in the database.
 * @property {string} BOOK_RETRIEVED_MESSAGE - Message sent when the information of a book is found and successfully retrieved from database.
 * @property {string} BOOK_S_RETRIEVED_MESSAGE - Message sent when the information of multiple books is found and successfully retrieved from database.
 */
export const bookControllerResponseMessages = {
  /**
   * Message sent when the information of a new book is successfully added to database.
   * @type {string}
   */
  BOOK_ADDED_MESSAGE: "Successful book addition",

  /**
   * Message sent when the information of a book is successfully updated.
   * @type {string}
   */
  BOOK_UPDATED_MESSAGE: "Successful book update",

  /**
   * Message sent when the information of a book is not found in the database.
   * @type {string}
   */
  BOOK_NOT_FOUND_MESSAGE: "Book was not found",

  /**
   * Message sent when the information of multiple books is not found in the database.
   * @type {string}
   */
  BOOK_S_NOT_FOUND_MESSAGE: "Books were not found",

  /**
   * Message sent when the information of a book is found and successfully retrieved from database.
   * @type {string}
   */
  BOOK_RETRIEVED_MESSAGE: "Successful book retrieval",

  /**
   * Message sent when the information of multiple books is found and successfully retrieved from database.
   * @type {string}
   */
  BOOK_S_RETRIEVED_MESSAGE: "Successful retrieval of books",
};
