/**
 * Intermediary controller HTTP response messages.
 * @module src/messages/response/bookAuthorControllerResponseMessages
 */

/**
 * Contains HTTP response messages sent by the intermediary controller.
 *
 * @type {object}
 * @property {string} RECORD_ADDED_MESSAGE - Message sent when a new record is added to the intermediary table in the database.
 */
export const bookAuthorControllerResponseMessages = {
  /**
   * Message sent when a new record is added to the intermediary table in the database.
   * @type {string}
   */
  RECORD_ADDED_MESSAGE: "Common record for book and author added",
};
