import { ValidationError } from "class-validator";
import { AppDataSource } from "config/dataSource";
import { Book } from "entities/Book";
import { IBookUpdate } from "interfaces/IBookUpdate";
import { appLogger } from "../../logs/loggerConfigs";
import { ServerError } from "errors/serverErrorClass";

const bookRepository = AppDataSource.getRepository(Book);

export const getBookByTitle = async (title: string): Promise<Book | null> => {
  try {
    return await bookRepository.findOneBy({ title: title });
  } catch (error) {
    if (error instanceof ValidationError) {
      appLogger.error(
        `Book repository: ${getBookByTitle.name} -> ValidationError detected and re-thrown`
      );

      throw error;
    }

    appLogger.error(
      `Book repository: ${getBookByTitle.name} -> ServerError thrown`
    );

    throw new ServerError("");
  }
};

export const getBookById = async (id: number) => {
  return await bookRepository.findOneBy({ id: id });
};

export const addBook = async (newBook: Book) => {
  return await bookRepository.save(newBook);
};

export const updateBook = async (id: number, updateObj: IBookUpdate) => {
  await bookRepository.update({ id: id }, updateObj);
};
