import { Book } from "entities/Book";
import { BookFormat } from "resources/enum/BookFormat";

export interface IEditionUpdate {
  isbn?: string;
  publicationDate?: Date;
  publisher?: string;
  pageCount?: number;
  bookFormat?: BookFormat;
  bookLanguage?: string;
  book?: Book;
}
