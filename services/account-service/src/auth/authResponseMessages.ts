/**
 * HTTP response messages for authentication.
 * @module src/auth/authResponseMessages
 */

/**
 * Contains HTTP response messages sent by the authentication
 * controller.
 *
 * @type {object}
 * @property {string} AUTHENTICATION_FAILED - Message sent when authentication has failed.
 * @property {string} AUTHENTICATION_SUCCESS - Message sent when authentication is successful.
 */
export const authResponseMessages = {
  /**
   * Message sent when authentication has failed.
   * @type {string}
   */
  AUTHENTICATION_FAILED: "Authentication failed",

  /**
   * Message sent when authentication is successful.
   * @type {string}
   */
  AUTHENTICATION_SUCCESS: "Authentication success",
};
