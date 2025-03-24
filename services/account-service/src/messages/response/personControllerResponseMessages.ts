/**
 * Person controller HTTP response messages.
 * @module src/messages/response/personControllerResponseMessages
 */

/**
 * Contains HTTP response messages sent by the person controller.
 *
 * @type {object}
 * @property {string} PERSON_INFO_ADDED_MESSAGE - Message sent when the personal information of a user is successfully added to database.
 * @property {string} PERSON_INFO_UPDATED_MESSAGE - Message sent when the personal information of an existing user is successfully updated.
 * @property {string} PERSON_INFO_RETRIEVED_MESSAGE - Message sent when the personal information of a user is successfully retrieved from database.
 * @property {string} PERSON_INFO_NOT_FOUND_MESSAGE - Message sent when the requested, personal information of a user is not found.
 */
export const personControllerResponseMessages = {
  /**
   * Message sent when the personal information of a user is successfully added to database.
   * @type {string}
   */
  PERSON_INFO_ADDED_MESSAGE: "Successful personal info addition",

  /**
   * Message sent when the personal information of an existing user is successfully updated.
   * @type {string}
   */
  PERSON_INFO_UPDATED_MESSAGE: "Successful person info update",

  /**
   * Message sent when the personal information of a user is successfully retrieved from database.
   * @type {string}
   */
  PERSON_INFO_RETRIEVED_MESSAGE: "Successful person info retrieval",

  /**
   * Message sent when the requested, personal information of a user is not found.
   * @type {string}
   */
  PERSON_INFO_NOT_FOUND_MESSAGE: "Person info was not found",
};
