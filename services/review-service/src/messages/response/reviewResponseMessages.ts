/**
 * Review controller HTTP response messages.
 * @module src/messages/response/reviewResponseMessages
 */

/**
 * Contains HTTP response messages sent by the review controller.
 *
 * @type {object}
 * @property {string} REVIEW_CREATED_MESSAGE - Message sent when a new review is successfully created/added.
 * @property {string} REVIEW_UPDATE_MESSAGE - Message sent when a review is successfully updated.
 * @property {string} REVIEW_NOT_FOUND_MESSAGE - Message sent when the requested review is not found.
 * @property {string} REVIEW_S_NOT_FOUND_MESSAGE - Message sent when the requested reviews are not found.
 * @property {string} REVIEW_RETRIEVED_MESSAGE - Message sent when the requested review is successfully retrieved.
 * @property {string} REVIEW_S_RETRIEVED_MESSAGE - Message sent when the requested reviews are successfully retrieved.
 */
export const reviewResponseMessages = {
  /**
   * Message sent when a new review is successfully created/added.
   * @type {string}
   */
  REVIEW_CREATED_MESSAGE: "Successful review creation",

  /**
   * Message sent when a review is successfully updated.
   * @type {string}
   */
  REVIEW_UPDATE_MESSAGE: "Successful review update",

  /**
   * Message sent when the requested review is not found.
   * @type {string}
   */
  REVIEW_NOT_FOUND_MESSAGE: "Review was not found",

  /**
   * Message sent when the requested reviews are not found.
   * @type {string}
   */
  REVIEW_S_NOT_FOUND_MESSAGE: "No reviews were found",

  /**
   * Message sent when the requested review is successfully retrieved.
   * @type {string}
   */
  REVIEW_RETRIEVED_MESSAGE: "Successful review retrieval",

  /**
   * Message sent when the requested reviews are successfully retrieved.
   * @type {string}
   */
  REVIEW_S_RETRIEVED_MESSAGE: "Successful retrieval of reviews",
};
