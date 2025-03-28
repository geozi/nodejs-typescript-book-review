import { Book } from "entities/Book";
import { Edition } from "entities/Edition";
import { Request } from "express";
import { IEditionUpdate } from "interfaces/IEditionUpdate";
import { BookFormat } from "resources/enum/BookFormat";
import { Genre } from "resources/enum/Genre";

export const reqBodyToEdition = (req: Request): Edition => {
  const {
    isbn,
    publicationDate,
    publisher,
    pageCount,
    bookFormat,
    bookLanguage,
    book,
  } = req.body;

  const newEdition = new Edition();
  newEdition.isbn = isbn;
  newEdition.publicationDate = new Date(publicationDate);
  newEdition.publisher = publisher;
  newEdition.pageCount = new Number(pageCount).valueOf();
  newEdition.bookLanguage = bookLanguage;

  switch (bookFormat) {
    case BookFormat.EBOOK.toString():
      newEdition.bookFormat = BookFormat.EBOOK;
      break;
    case BookFormat.HARDCOVER.toString():
      newEdition.bookFormat = BookFormat.HARDCOVER;
      break;
  }

  const relatedBook = new Book();
  relatedBook.id = book.id;
  relatedBook.title = book.title;

  switch (book.genre) {
    case Genre.DRAMA.toString():
      relatedBook.genre = Genre.DRAMA;
      break;
    case Genre.FICTION.toString():
      relatedBook.genre = Genre.FICTION;
      break;
    case Genre.NON_FICTION.toString():
      relatedBook.genre = Genre.NON_FICTION;
      break;
    case Genre.POETRY.toString():
      relatedBook.genre = Genre.POETRY;
      break;
  }

  newEdition.book = relatedBook;

  return newEdition;
};

export const reqBodyToEditionUpdate = (
  req: Request
): { id: number; edition: IEditionUpdate } => {
  const {
    id,
    isbn,
    publicationDate,
    publisher,
    pageCount,
    bookFormat,
    bookLanguage,
    book,
  } = req.body;

  const idAsNumber = new Number(id).valueOf();
  const edition: IEditionUpdate = {};

  if (isbn) {
    edition.isbn = isbn;
  }

  if (publicationDate) {
    edition.publicationDate = new Date(publicationDate);
  }

  if (publisher) {
    edition.publisher = publisher;
  }

  if (pageCount) {
    edition.pageCount = new Number(pageCount).valueOf();
  }

  if (bookFormat) {
    switch (bookFormat) {
      case BookFormat.EBOOK.toString():
        edition.bookFormat = BookFormat.EBOOK;
        break;
      case BookFormat.HARDCOVER.toString():
        edition.bookFormat = BookFormat.HARDCOVER;
        break;
    }
  }

  if (bookLanguage) {
    edition.bookLanguage = bookLanguage;
  }

  if (book) {
    const relatedBook = new Book();
    relatedBook.id = book.id;
    relatedBook.title = book.title;

    switch (book.genre) {
      case Genre.DRAMA.toString():
        relatedBook.genre = Genre.DRAMA;
        break;
      case Genre.FICTION.toString():
        relatedBook.genre = Genre.FICTION;
        break;
      case Genre.NON_FICTION.toString():
        relatedBook.genre = Genre.NON_FICTION;
        break;
      case Genre.POETRY.toString():
        relatedBook.genre = Genre.POETRY;
        break;
    }

    edition.book = relatedBook;
  }

  const data = {
    id: idAsNumber,
    edition: edition,
  };

  return data;
};
