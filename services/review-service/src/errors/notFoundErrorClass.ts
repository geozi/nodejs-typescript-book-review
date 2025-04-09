import { httpCodes } from "resources/codes/responseStatusCodes";
import { AbstractError } from "./abstractErrorClass";

export class NotFoundError extends AbstractError {
  constructor(message: string) {
    super(httpCodes.NOT_FOUND, message);
    this.name = "NotFoundError";
    this.message = message;
  }
}
