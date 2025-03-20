/**
 * IPerson interface.
 * @module src/interfaces/documents/iPerson.interface
 */
import { IAddress } from "interfaces/secondary/iAddress.interface";
import { Document } from "mongoose";

/**
 * Represents the personal information of a user.
 *
 * @interface
 * @extends {Document}
 * @property {string} firstName - The first name of a person.
 * @property {string} lastName - The last name of a person.
 * @property {string} ssn - The social security number of a person.
 * @property {string} phoneNumber - The phone number of a person.
 * @property {IAddress} address - The address of a person. See {@link IAddress}.
 * @property {string} username - The username assigned to a person.
 */
export interface IPerson extends Document {
  /**
   *  The first name of a person.
   * @type {string}
   */
  firstName: string;

  /**
   * The last name of a person.
   * @type {string}
   */
  lastName: string;

  /**
   * The social security number of a person.
   * @type {string}
   */
  ssn: string;

  /**
   * The phone number of a person.
   * @type {string}
   */
  phoneNumber: string;

  /**
   * The address of a person. See {@link IAddress}.
   * @type {IAddress}
   */
  address: IAddress;

  /**
   * The username assigned to a person.
   * @type {string}
   */
  username: string;
}
