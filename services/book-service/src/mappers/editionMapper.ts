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
  newEdition.publication_date = new Date(publicationDate);
  newEdition.publisher = publisher;
  newEdition.page_count = new Number(pageCount).valueOf();
  newEdition.book_language = bookLanguage;

  switch (bookFormat) {
    case BookFormat.EBOOK.toString():
      newEdition.book_format = BookFormat.EBOOK;
      break;
    case BookFormat.HARDCOVER.toString():
      newEdition.book_format = BookFormat.HARDCOVER;
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
): (number | IEditionUpdate)[] => {
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
  const edition: IEditionUpdate = {
    isbn: isbn,
    publisher: publisher,
    book_language: bookLanguage,
  };

  if (publicationDate) {
    edition.publication_date = new Date(publicationDate);
  }

  if (pageCount) {
    edition.page_count = new Number(pageCount).valueOf();
  }

  if (bookFormat) {
    switch (bookFormat) {
      case BookFormat.EBOOK.toString():
        edition.book_format = BookFormat.EBOOK;
        break;
      case BookFormat.HARDCOVER.toString():
        edition.book_format = BookFormat.HARDCOVER;
        break;
    }
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

  return [idAsNumber, edition];
};
