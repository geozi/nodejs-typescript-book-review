/**
 * IPersonUpdate interface.
 * @module src/interfaces/secondary/IPersonUpdate
 */
import { Types } from "mongoose";
import { IAddress } from "./IAddress";

/**
 * Represents a data object used to update the personal
 * information of a user.
 *
 * @interface
 * @property {Types.ObjectId} id - The ID of the document containing the personal information.
 * @property {string} [firstName] - (Optional) The first name of a person.
 * @property {string} [lastName] - (Optional) The last name of a person.
 * @property {string} [ssn] - (Optional) The social security number of a person.
 * @property {string} [phoneNumber] - (Optional) The phone number of a person.
 * @property {IAddress} [address] - (Optional) The address of a person. See {@link IAddress}.
 * @property {string} username - The username assigned to person.
 */
export interface IPersonUpdate {
  /**
   * The ID of the document containing the personal information.
   * @type {Types.ObjectId}
   */
  id: Types.ObjectId;

  /**
   * (Optional) The first name of a person.
   * @type {string}
   */
  firstName?: string;

  /**
   * (Optional) The last name of a person.
   * @type {string}
   */
  lastName?: string;

  /**
   * (Optional) The social security number of a person.
   * @type {string}
   */
  ssn?: string;

  /**
   * (Optional) The phone number of a person.
   * @type {string}
   */
  phoneNumber?: string;

  /**
   * (Optional) The address of a person. See {@link IAddress}.
   * @type {IAddress}
   */
  address?: IAddress;

  /**
   * The username assigned to person.
   * @type {string}
   */
  username: string;
}
