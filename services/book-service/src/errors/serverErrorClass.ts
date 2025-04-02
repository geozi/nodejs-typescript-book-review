/**
 * ServerError class.
 * @module src/errors/serverErrorClass
 */
import { httpCodes } from "resources/codes/responseStatusCodes";
import { AbstractError } from "./abstractErrorClass";
/**
 * Custom wrapper for internal server error (500).
 * @extends {AbstractError}
 */
export class ServerError extends AbstractError {
  /**
   * Creates an instance of ServerError.
   * @param {string} message The error message.
   */
  constructor(message: string) {
    super(httpCodes.INTERNAL_SERVER_ERROR, message);
    this.name = "ServerError";
    this.message = message;
  }
}
