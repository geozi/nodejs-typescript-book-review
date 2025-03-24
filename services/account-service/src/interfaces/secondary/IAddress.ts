/**
 * IAddress interface.
 * @module src/interfaces/secondary/IAddress
 */

/**
 * Represents the address information of a person.
 *
 * @interface
 * @property {string} streetName - The street name of an address.
 * @property {string} residenceNumber - The residence number of an address.
 * @property {string} [zipCode] - (Optional) The zip code of an address.
 * @property {string} city - The city where the address is located.
 */
export interface IAddress {
  /**
   * The street name of an address.
   * @type {string}
   */
  streetName: string;

  /**
   * The residence number of an address.
   * @type {string}
   */
  residenceNumber: string;

  /**
   * (Optional) The zip code of an address.
   * @type {string}
   */
  zipCode?: string;

  /**
   * The city where the address is located.
   * @type {string}
   */
  city: string;
}
