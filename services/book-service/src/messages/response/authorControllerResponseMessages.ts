/**
 * Author controller HTTP response messages.
 * @module src/messages/response/authorControllerResponseMessages
 */

/**
 * Contains HTTP response messages sent by the author controller.
 *
 * @type {object}
 * @property {string} AUTHOR_ADDED - Message sent when the information of a new author is successfully added to database.
 * @property {string} AUTHOR_UPDATED - Message sent when the information of an author is successfully updated.
 * @property {string} AUTHOR_NOT_FOUND - Message sent when the information of an author is not found in the database.
 * @property {string} AUTHOR_RETRIEVED - Message sent when the information of an author is found and successfully retrieved from database.
 */
export const authorControllerResponseMessages = {
  /**
   * Message sent when the information of a new author is successfully added to database.
   * @type {string}
   */
  AUTHOR_ADDED: "Successful author addition",

  /**
   * Message sent when the information of an author is successfully updated.
   * @type {string}
   */
  AUTHOR_UPDATED: "Successful author update",

  /**
   * Message sent when the information of an author is not found in the database.
   * @type {string}
   */
  AUTHOR_NOT_FOUND: "Author was not found",

  /**
   * Message sent when the information of an author is found and successfully retrieved from database.
   * @type {string}
   */
  AUTHOR_RETRIEVED: "Successful author retrieval",
};
