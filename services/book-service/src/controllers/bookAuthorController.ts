/**
 * BookAuthor controller.
 * @module src/controllers/bookAuthorController
 */
import { NotFoundError } from "errors/notFoundErrorClass";
import { ServerError } from "errors/serverErrorClass";
import { Request, Response } from "express";
import { appLogger } from "logs/loggerConfigs";
import { authorControllerResponseMessages } from "messages/response/authorControllerResponseMessages";
import { bookAuthorControllerResponseMessages } from "messages/response/bookAuthorControllerResponseMessages";
import { bookControllerResponseMessages } from "messages/response/bookControllerResponseMessages";
import { addAuthor, getAuthorById } from "repositories/authorRepository";
import { addBook, getBookById } from "repositories/bookRepository";
import { apiVersionNumbers } from "resources/codes/apiVersionNumbers";
import { httpCodes } from "resources/codes/responseStatusCodes";

/**
 * Handles HTTP requests for record addition to intermediary table.
 *
 * @param {Request} req - An HTTP request.
 * @param {Response} res - An HTTP response.
 * @returns {Promise<void>} A promise that resolves to void.
 * @throws - {@link NotFoundError}
 */
export const callBookAuthorAddition = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { bookId, authorId } = req.body;

    const book = await getBookById(bookId);
    if (book === null) {
      throw new NotFoundError(
        bookControllerResponseMessages.BOOK_NOT_FOUND_MESSAGE
      );
    }

    const author = await getAuthorById(authorId);
    if (author === null) {
      throw new NotFoundError(
        authorControllerResponseMessages.AUTHOR_NOT_FOUND_MESSAGE
      );
    }

    book.authors = [];
    book.authors.push(author);
    await addBook(book);

    author.books = [];
    author.books.push(book);
    await addAuthor(author);

    res
      .setHeader("x-api-version", apiVersionNumbers.VERSION_1_0)
      .status(httpCodes.CREATED)
      .json({
        message: bookAuthorControllerResponseMessages.RECORD_ADDED_MESSAGE,
      });
  } catch (error) {
    if (error instanceof ServerError || error instanceof NotFoundError) {
      appLogger.error(
        `BookAuthor controller: ${callBookAuthorAddition.name} -> ${error.name} detected and caught`
      );

      res.status(error.httpCode).json({ message: error.message });
      return;
    }
  }
};
