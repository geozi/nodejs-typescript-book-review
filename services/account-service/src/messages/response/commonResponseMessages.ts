/**
 * Common HTTP response messages.
 * @module src/messages/response/commonResponseMessages
 */

/**
 * Contains HTTP response messages sent by all controllers.
 *
 * @type {object}
 * @property {string} BAD_REQUEST_MESSAGE - Message sent when an HTTP request is invalid.
 * @property {string} SERVER_ERROR_MESSAGE - Message sent when an internal server error occurs.
 * @property {string} REDIS_ERROR_MESSAGE - Message sent when a redis server error occurs.
 * @property {string} INVALID_JSON_MESSAGE - Message sent when the json payload of an HTTP request is invalid.
 */
export const commonResponseMessages = {
  /**
   * Message sent when an HTTP request is invalid.
   * @type {string}
   */
  BAD_REQUEST_MESSAGE: "Bad request",

  /**
   * Message sent when an internal server error occurs.
   * @type {string}
   */
  SERVER_ERROR_MESSAGE: "Internal server error",

  /**
   * Message sent when a redis server error occurs.
   * @type {string}
   */
  REDIS_ERROR_MESSAGE: "Redis server error",

  /**
   * Message sent when the json payload of an HTTP request is invalid.
   * @type {string}
   */
  INVALID_JSON_MESSAGE: "Invalid JSON payload",
};
