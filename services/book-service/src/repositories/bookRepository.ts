import { AppDataSource } from "config/dataSource";
import { Book } from "entities/Book";
import { IBookUpdate } from "interfaces/IBookUpdate";

const bookRepository = AppDataSource.getRepository(Book);

export const getBookByTitle = async (title: string) => {
  return await bookRepository.findOneBy({ title: title });
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
