/**
 * IUser interface.
 * @module src/interfaces/documents/IUser
 */
import { Document } from "mongoose";
import { RoleType } from "resources/enums/roleType.enum";

/**
 * Represents a user.
 *
 * @interface
 * @extends {Document}
 * @property {string} username - The username of a user.
 * @property {string} email - The email of a user.
 * @property {string} password - The password of a user.
 * @property {RoleType} role - An enum representing the role assigned to a user. See {@link RoleType}.
 */
export interface IUser extends Document {
  /**
   * The username of a user.
   * @type {string}
   */
  username: string;

  /**
   * The email of a user.
   * @type {string}
   */
  email: string;

  /**
   * The password of a user.
   * @type {string}
   */
  password: string;

  /**
   * An enum representing the role assigned to a user. See {@link RoleType}.
   * @type {RoleType}
   */
  role: RoleType;
}
