/**
 * User controller HTTP response messages.
 * @module src/messages/response/userControllerResponse.message
 */

/**
 * Contains HTTP response messages sent by the user controller.
 *
 * @type {object}
 * @property {string} USER_REGISTERED_MESSAGE - Message sent when a new user is created and successfully added to database.
 * @property {string} USER_UPDATED_MESSAGE - Message sent when an existing user is successfully updated.
 * @property {string} USER_RETRIEVED_MESSAGE - Message sent when a user is successfully retrieved from database.
 * @property {string} USER_NOT_FOUND_MESSAGE - Message sent when the requested user is not found.
 */
export const userControllerResponseMessages = {
  /**
   * Message sent when a new user is created and successfully added to database.
   * @type {string}
   */
  USER_REGISTERED_MESSAGE: "Successful user registration",

  /**
   * Message sent when an existing user is successfully updated.
   * @type {string}
   */
  USER_UPDATED_MESSAGE: "Successful user update",

  /**
   * Message sent when a user is successfully retrieved from database.
   * @type {string}
   */
  USER_RETRIEVED_MESSAGE: "Successful user retrieval",

  /**
   * Message sent when the requested user is not found.
   * @type {string}
   */
  USER_NOT_FOUND_MESSAGE: "User was not found",
};
