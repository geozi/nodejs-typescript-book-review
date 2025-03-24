import { httpCodes } from "resources/codes/responseStatusCodes";
import { AbstractError } from "./abstractErrorClass";

export class ServerError extends AbstractError {
  constructor(message: string) {
    super(httpCodes.INTERNAL_SERVER_ERROR, message);
    this.name = "ServerError";
    this.message = message;
  }
}
