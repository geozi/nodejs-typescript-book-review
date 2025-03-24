/**
 * IUserUpdate interface.
 * @module src/interfaces/secondary/IUserUpdate
 */
import { Types } from "mongoose";

/**
 * Represents a data object used to update the information of a user.
 *
 * @interface
 * @property {Types.ObjectId} id - The ID of the document containing user information.
 * @property {string} [email] - (Optional) The new email of a user.
 * @property {string} [password] - (Optional) The new password of a user.
 */
export interface IUserUpdate {
  /**
   * The ID of the document containing user information.
   * @type {Types.ObjectId}
   */
  id: Types.ObjectId;

  /**
   * (Optional) The new email of a user.
   * @type {string}
   */
  email?: string;

  /**
   * (Optional) The new password of a user.
   * @type {string}
   */
  password?: string;
}
