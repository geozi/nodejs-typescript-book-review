import { Book } from "entities/Book";
import { BookFormat } from "resources/enum/BookFormat";

export interface IEditionUpdate {
  isbn?: string;
  publication_date?: Date;
  publisher?: string;
  page_count?: number;
  book_format?: BookFormat;
  book_language?: string;
  book?: Book;
}
