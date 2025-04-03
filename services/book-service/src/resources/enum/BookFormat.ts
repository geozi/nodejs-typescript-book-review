/**
 * BookFormat enums.
 * @module src/resources/enum/BookFormat
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { EnumMember } from "typescript";

/**
 * Contains {@link EnumMember} corresponding to book formats.
 *
 * @readonly
 * @enum
 */
export enum BookFormat {
  /**
   * Hardcover format.
   * @readonly
   * @type {EnumMember}
   */
  HARDCOVER = "Hardcover",

  /**
   * Ebook format.
   * @readonly
   * @type {EnumMember}
   */
  EBOOK = "Ebook",
}

/**
 * Book format array.
 * @type {BookFormat[]}
 */
export const bookFormatArray = [BookFormat.HARDCOVER, BookFormat.EBOOK];
