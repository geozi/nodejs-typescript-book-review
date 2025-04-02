/**
 * Book mapper.
 * @module src/mappers/bookMapper
 */
import { Book } from "entities/Book";
import { Request } from "express";
import { IBookUpdate } from "interfaces/IBookUpdate";
import { Genre, genreArray } from "resources/enum/Genre";

/**
 * Maps the body of a Request object to a {@link Book} object.
 *
 * @param {Request} req - An HTTP request.
 * @returns {Book} A {@link Book} object.
 */
export const reqBodyToBook = (req: Request): Book => {
  const { title, genre } = req.body;

  const newBook = new Book();
  newBook.title = title;

  switch (genre) {
    case Genre.DRAMA.toString():
      newBook.genre = Genre.DRAMA;
      break;
    case Genre.FICTION.toString():
      newBook.genre = Genre.FICTION;
      break;
    case Genre.NON_FICTION.toString():
      newBook.genre = Genre.NON_FICTION;
      break;
    case Genre.POETRY.toString():
      newBook.genre = Genre.POETRY;
      break;
  }

  return newBook;
};

/**
 * Maps the body of a Request object to a custom data object.
 *
 * @param {Request} req - An HTTP request.
 * @returns A custom object containing an ID and an {@link IBookUpdate} object.
 */
export const reqBodyToBookUpdate = (
  req: Request
): {
  id: number;
  book: IBookUpdate;
} => {
  const { id, title, genre } = req.body;

  const book: IBookUpdate = {};

  if (title) {
    book.title = title;
  }

  if (genre) {
    switch (genre) {
      case Genre.DRAMA.toString():
        book.genre = Genre.DRAMA;
        break;
      case Genre.FICTION.toString():
        book.genre = Genre.FICTION;
        break;
      case Genre.NON_FICTION.toString():
        book.genre = Genre.NON_FICTION;
        break;
      case Genre.POETRY.toString():
        book.genre = Genre.POETRY;
        break;
    }
  }

  const data = {
    id: id,
    book: book,
  };

  return data;
};

/**
 * Maps the body of a Request object to a {@link Genre} enum.
 *
 * @param {Request} req - An HTTP request.
 * @returns {Genre} A {@link Genre} enum.
 */
export const reqBodyToGenre = (req: Request): Genre => {
  const { genre } = req.body;

  let genreAsEnum = Genre.FICTION;
  for (let i = 1; i < genreArray.length; i++) {
    if (genreArray[i].toString() === genre) {
      genreAsEnum = genreArray[i];
      break;
    }
  }

  return genreAsEnum;
};
