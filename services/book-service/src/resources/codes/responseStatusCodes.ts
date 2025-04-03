/**
 * HTTP status codes.
 * @module src/resources/codes/responseStatusCodes
 */

/**
 * Contains HTTP status codes.
 *
 * @type {object}
 * @property {number} OK - {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200}
 * @property {number} CREATED - {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/201}
 * @property {number} NO_CONTENT - {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/204}
 * @property {number} BAD_REQUEST - {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/400}
 * @property {number} UNAUTHORIZED - {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/401}
 * @property {number} NOT_FOUND - {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/404}
 * @property {number} FORBIDDEN - {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/403}
 * @property {number} INTERNAL_SERVER_ERROR - {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/500}
 */
export const httpCodes = {
  /**
   * {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200}
   * @type {number}
   */
  OK: 200,

  /**
   * {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/201}
   * @type {number}
   */
  CREATED: 201,

  /**
   * {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/204}
   * @type {number}
   */
  NO_CONTENT: 204,

  /**
   * {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/400}
   * @type {number}
   */
  BAD_REQUEST: 400,

  /**
   * {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/401}
   * @type {number}
   */
  UNAUTHORIZED: 401,

  /**
   * {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/404}
   * @type {number}
   */
  NOT_FOUND: 404,

  /**
   * {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/403}
   * @type {number}
   */
  FORBIDDEN: 403,

  /**
   * {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/500}
   * @type {number}
   */
  INTERNAL_SERVER_ERROR: 500,
};
