import { httpCodes } from "resources/codes/responseStatusCodes";
import { AbstractError } from "./abstractError.class";

export class ServerError extends AbstractError {
  constructor(message: string) {
    super(httpCodes.INTERNAL_SERVER_ERROR, message);
    this.name = "ServerError";
    this.message = message;
  }
}
