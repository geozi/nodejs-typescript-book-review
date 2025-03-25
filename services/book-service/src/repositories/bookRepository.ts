import { validate, ValidationError } from "class-validator";
import { AppDataSource } from "config/dataSource";
import { Book } from "entities/Book";
import { IBookUpdate } from "interfaces/IBookUpdate";
import { appLogger } from "../../logs/loggerConfigs";
import { ServerError } from "errors/serverErrorClass";
import { commonResponseMessages } from "messages/response/commonResponseMessages";
import { Genre } from "resources/enum/Genre";

const bookRepository = AppDataSource.getRepository(Book);

export const getBooksByGenre = async (genre: Genre) => {
  try {
    const retrievedBooks = await bookRepository.findBy({ genre: genre });
    if (retrievedBooks.length === 0) {
      return new Promise((resolve) => {
        resolve(null);
      });
    }

    return retrievedBooks;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    appLogger.error(
      `Book repository: ${getBooksByGenre.name} -> ServerError thrown`
    );

    throw new ServerError(commonResponseMessages.SERVER_ERROR_MESSAGE);
  }
};

export const getBookByTitle = async (title: string): Promise<Book | null> => {
  try {
    return await bookRepository.findOneBy({ title: title });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    appLogger.error(
      `Book repository: ${getBookByTitle.name} -> ServerError thrown`
    );

    throw new ServerError(commonResponseMessages.SERVER_ERROR_MESSAGE);
  }
};

export const getBookById = async (id: number): Promise<Book | null> => {
  try {
    return await bookRepository.findOneBy({ id: id });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    appLogger.error(
      `Book repository: ${getBookById.name} -> ServerError thrown`
    );

    throw new ServerError(commonResponseMessages.SERVER_ERROR_MESSAGE);
  }
};

export const addBook = async (newBook: Book): Promise<Book> => {
  try {
    const errors = await validate(newBook);
    if (errors.length > 0) {
      throw new ValidationError();
    }

    return await bookRepository.save(newBook);
  } catch (error) {
    if (error instanceof ValidationError) {
      appLogger.error(
        `Book repository: ${addBook.name} -> ValidationError detected and re-thrown`
      );

      throw error;
    }

    appLogger.error(`Book repository: ${addBook.name} -> ServerError thrown`);

    throw new ServerError(commonResponseMessages.SERVER_ERROR_MESSAGE);
  }
};

export const updateBook = async (
  id: number,
  updateObj: IBookUpdate
): Promise<Book | null> => {
  try {
    const result = await bookRepository.update({ id: id }, updateObj);
    if (result.affected === 0) {
      return new Promise((resolve) => {
        resolve(null);
      });
    }

    return await bookRepository.findOneBy({ id: id });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    appLogger.error(
      `Book repository: ${updateBook.name} -> ServerError thrown`
    );

    throw new ServerError(commonResponseMessages.SERVER_ERROR_MESSAGE);
  }
};
