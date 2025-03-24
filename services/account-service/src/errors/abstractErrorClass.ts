/**
 * AbstractError class.
 * @module src/errors/abstractErrorClass
 */

/**
 * Enables the inheritance of common properties among its sub-classes.
 * @extends {Error}
 */
export abstract class AbstractError extends Error {
  public httpCode: number;

  constructor(httpCode: number, message: string) {
    super(message);
    this.httpCode = httpCode;
  }
}
