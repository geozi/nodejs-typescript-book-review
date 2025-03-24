/**
 * NotFoundError class.
 * @module src/errors/notFoundErrorClass
 */
import { httpCodes } from "resources/codes/responseStatusCodes";
import { AbstractError } from "./abstractErrorClass";

/**
 * Triggered when the requested document(s) is/are not found (404).
 * @extends {AbstractError}
 */
export class NotFoundError extends AbstractError {
  /**
   * Creates an instance of NotFoundError.
   * @param {string} message The error message.
   */
  constructor(message: string) {
    super(httpCodes.NOT_FOUND, message);
    this.name = "NotFoundError";
    this.message = message;
  }
}
