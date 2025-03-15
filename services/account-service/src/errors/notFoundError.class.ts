import { httpCodes } from "resources/codes/responseStatusCodes";
import { AbstractError } from "./abstractError.class";

export class NotFoundError extends AbstractError {
  constructor(message: string) {
    super(httpCodes.NOT_FOUND, message);
    this.name = "NotFoundError";
    this.message = message;
  }
}
