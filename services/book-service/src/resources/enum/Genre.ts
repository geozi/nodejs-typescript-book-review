/**
 * Genre enums.
 * @module src/resources/enum/Genre
 */

/**
 * Contains enums corresponding to book genres.
 *
 * @readonly
 * @enum
 */
export enum Genre {
  /**
   * Fiction genre.
   * @readonly
   * @type {EnumMember}
   */
  FICTION = "Fiction",

  /**
   * Non-fiction genre.
   * @readonly
   * @type {EnumMember}
   */
  NON_FICTION = "Non-fiction",

  /**
   * Poetry genre.
   * @readonly
   * @type {EnumMember}
   */
  POETRY = "Poetry",

  /**
   * Drama genre.
   * @readonly
   * @type {EnumMember}
   */
  DRAMA = "Drama",
}

/**
 * Genre array.
 * @readonly
 * @type {Genre[]}
 */
export const genreArray = [
  Genre.FICTION,
  Genre.NON_FICTION,
  Genre.POETRY,
  Genre.DRAMA,
];
