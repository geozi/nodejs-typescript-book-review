/**
 * Edition controller HTTP response messages.
 * @module src/messages/response/editionControllerResponseMessages
 */

/**
 * Contains HTTP response messages sent by the edition controller.
 *
 * @type {object}
 * @property {string} EDITION_ADDED_MESSAGE - Message sent when the information of a new book edition is successfully added to database.
 * @property {string} EDITION_UPDATED_MESSAGE - Message sent when the information of a book edition is successfully updated.
 * @property {string} EDITION_NOT_FOUND_MESSAGE - Message sent when the information of a book edition is not found in the database.
 * @property {string} EDITION_S_NOT_FOUND_MESSAGE - Message sent when the information of multiple book editions is not found in the database.
 * @property {string} EDITION_RETRIEVED_MESSAGE - Message sent when the information of a book edition is successfully retrieved from database.
 * @property {string} EDITION_S_RETRIEVED_MESSAGE - Message sent when the information of multiple book editions is successfully retrieved from database.
 */
export const editionControllerResponseMessages = {
  /**
   * Message sent when the information of a new book edition is successfully added to database.
   * @type {string}
   */
  EDITION_ADDED_MESSAGE: "Successful edition addition",

  /**
   * Message sent when the information of a book edition is successfully updated.
   * @type {string}
   */
  EDITION_UPDATED_MESSAGE: "Successful edition update",

  /**
   * Message sent when the information of a book edition is not found in the database.
   * @type {string}
   */
  EDITION_NOT_FOUND_MESSAGE: "Edition was not found",

  /**
   * Message sent when the information of multiple book editions is not found in the database.
   * @type {string}
   */
  EDITION_S_NOT_FOUND_MESSAGE: "Editions were not found",

  /**
   * Message sent when the information of a book edition is successfully retrieved from database.
   * @type {string}
   */
  EDITION_RETRIEVED_MESSAGE: "Successful edition retrieval",

  /**
   * Message sent when the information of multiple book editions is successfully retrieved from database.
   * @type {string}
   */
  EDITION_S_RETRIEVED_MESSAGE: "Successful retrieval of editions",
};
