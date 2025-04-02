/**
 * Edition controller HTTP response messages.
 * @module src/messages/response/editionControllerResponseMessages
 */

/**
 * Contains HTTP response messages sent by the edition controller.
 *
 * @type {object}
 * @property {string} EDITION_ADDED - Message sent when the information of a new book edition is successfully added to database.
 * @property {string} EDITION_UPDATED - Message sent when the information of a book edition is successfully updated.
 * @property {string} EDITION_NOT_FOUND - Message sent when the information of a book edition is not found in the database.
 * @property {string} EDITION_S_NOT_FOUND - Message sent when the information of multiple book editions is not found in the database.
 * @property {string} EDITION_RETRIEVED - Message sent when the information of a book edition is successfully retrieved from database.
 * @property {string} EDITION_S_RETRIEVED - Message sent when the information of multiple book editions is successfully retrieved from database.
 */
export const editionControllerResponseMessages = {
  /**
   * Message sent when the information of a new book edition is successfully added to database.
   * @type {string}
   */
  EDITION_ADDED: "Successful edition addition",

  /**
   * Message sent when the information of a book edition is successfully updated.
   * @type {string}
   */
  EDITION_UPDATED: "Successful edition update",

  /**
   * Message sent when the information of a book edition is not found in the database.
   * @type {string}
   */
  EDITION_NOT_FOUND: "Edition was not found",

  /**
   * Message sent when the information of multiple book editions is not found in the database.
   * @type {string}
   */
  EDITION_S_NOT_FOUND: "Editions were not found",

  /**
   * Message sent when the information of a book edition is successfully retrieved from database.
   * @type {string}
   */
  EDITION_RETRIEVED: "Successful edition retrieval",

  /**
   * Message sent when the information of multiple book editions is successfully retrieved from database.
   * @type {string}
   */
  EDITION_S_RETRIEVED: "Successful retrieval of editions",
};
