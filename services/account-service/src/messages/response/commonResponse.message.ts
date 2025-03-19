/**
 * Common HTTP response messages.
 * @module src/messages/response/commonResponse.message
 */

/**
 * Contains HTTP response messages sent by all controllers.
 *
 * @type {object}
 * @property {string} BAD_REQUEST - Message sent when an HTTP request is invalid.
 * @property {string} SERVER_ERROR - Message sent when an internal server error occurs.
 * @property {string} REDIS_ERROR - Message sent when a redis server error occurs.
 * @property {string} INVALID_JSON - Message sent when the json payload of an HTTP request is invalid.
 */
export const commonResponseMessages = {
  /**
   * Message sent when an HTTP request is invalid.
   * @type {string}
   */
  BAD_REQUEST: "Bad request",

  /**
   * Message sent when an internal server error occurs.
   * @type {string}
   */
  SERVER_ERROR: "Internal server error",

  /**
   * Message sent when a redis server error occurs.
   * @type {string}
   */
  REDIS_ERROR: "Redis server error",

  /**
   * Message sent when the json payload of an HTTP request is invalid.
   * @type {string}
   */
  INVALID_JSON: "Invalid JSON payload",
};
