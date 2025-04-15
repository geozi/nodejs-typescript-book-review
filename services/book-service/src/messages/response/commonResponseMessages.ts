/**
 * Common HTTP response messages.
 * @module src/messages/response/commonResponseMessages
 */

/**
 * Contains HTTP response messages sent by all controllers.
 *
 * @type {object}
 * @property {string} SERVER_ERROR_MESSAGE - Message sent when an internal server error occurs.
 * @property {string} INVALID_JSON_MESSAGE - Message sent when the json payload of an HTTP request is invalid.
 * @property {string} REQUEST_BODY_REQUIRED_MESSAGE - Message sent when the Request object has no body field.
 */
export const commonResponseMessages = {
  /**
   * Message sent when an internal server error occurs.
   * @type {string}
   */
  SERVER_ERROR_MESSAGE: "Internal server error",

  /**
   * Message sent when the json payload of an HTTP request is invalid.
   * @type {string}
   */
  INVALID_JSON_MESSAGE: "Invalid JSON payload",

  /**
   * Message sent when the Request object has no body field.
   * @type {string}
   */
  REQUEST_BODY_REQUIRED_MESSAGE: "HTTP request must have a body field",
};
