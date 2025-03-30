import { Book } from "entities/Book";
import { Request } from "express";
import { IBookUpdate } from "interfaces/IBookUpdate";
import { Genre, genreArray } from "resources/enum/Genre";

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

export const reqBodyToBookUpdate = (
  req: Request
): {
  id: number;
  book: IBookUpdate;
} => {
  const { id, title, genre } = req.body;

  const idAsNumber = new Number(id).valueOf();
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
    id: idAsNumber,
    book: book,
  };

  return data;
};

export const reqBodyToGenre = (req: Request) => {
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
