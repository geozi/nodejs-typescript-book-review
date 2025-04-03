/**
 * BookFormat enums.
 * @module src/resources/enum/BookFormat
 */

/**
 * Contains enums corresponding to book formats.
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
