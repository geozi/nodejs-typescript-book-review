/**
 * Edition mapper.
 * @module src/mappers/editionMapper
 */
import { Edition } from "entities/Edition";
import { NotFoundError } from "errors/notFoundErrorClass";
import { Request } from "express";
import { IEditionUpdate } from "interfaces/IEditionUpdate";
import { bookControllerResponseMessages } from "messages/response/bookControllerResponseMessages";
import { getBookById } from "repositories/bookRepository";
import { BookFormat } from "resources/enum/BookFormat";

/**
 * Maps the body of a Request object to an {@link Edition} object.
 *
 * @param {Request} req - An HTTP request.
 * @returns {Promise<Edition>} A promise that resolves to an {@link Edition} object.
 * @throws - {@link NotFoundError}
 */
export const reqBodyToEdition = async (req: Request): Promise<Edition> => {
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
  newEdition.pageCount = pageCount;
  newEdition.bookLanguage = bookLanguage;

  switch (bookFormat) {
    case BookFormat.EBOOK.toString():
      newEdition.bookFormat = BookFormat.EBOOK;
      break;
    case BookFormat.HARDCOVER.toString():
      newEdition.bookFormat = BookFormat.HARDCOVER;
      break;
  }

  const relatedBook = await getBookById(book.id);

  if (relatedBook) {
    newEdition.book = relatedBook;
  } else {
    throw new NotFoundError(bookControllerResponseMessages.BOOK_NOT_FOUND);
  }

  return newEdition;
};

/**
 * Maps the body of a Request object to a custom data object.
 *
 * @param {Request} req - An HTTP request.
 * @returns A promise that resolves to an object containing an ID and an {@link IEditionUpdate} object.
 * @throws - {@link NotFoundError}
 */
export const reqBodyToEditionUpdate = async (
  req: Request
): Promise<{ id: number; edition: IEditionUpdate }> => {
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
    edition.pageCount = pageCount;
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
    const relatedBook = await getBookById(book.id);
    if (relatedBook) {
      edition.book = relatedBook;
    } else {
      throw new NotFoundError(bookControllerResponseMessages.BOOK_NOT_FOUND);
    }
  }

  const data = {
    id: id,
    edition: edition,
  };

  return data;
};
