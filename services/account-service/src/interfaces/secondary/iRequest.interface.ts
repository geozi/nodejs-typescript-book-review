/**
 * IRequest interface.
 * @module src/interfaces/secondary/iRequest.interface
 */
import { Request } from "express";
import { IUser } from "interfaces/documents/iUser.interface";

/**
 * Represents an extended version of a typical HTTP request.
 *
 * @interface
 * @extends {Request}
 * @property {IUser} user - The information of a user. See {@link IUser}.
 */
export interface IRequest extends Request {
  /**
   * The information of a user. See {@link IUser}.
   * @type {IUser}
   */
  user: IUser;
}
