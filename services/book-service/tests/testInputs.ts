import { BookFormat } from "resources/enum/BookFormat";

export const validAuthorInput = {
  firstName: "Lilah",
  lastName: "Wong",
};

export const invalidAuthorInput = {
  NAME_INVALID: "12",
  NAME_TOO_SHORT: "a",
};

export const validEditionInput = {
  isbn: "9780439023481",
  publication_date: "2008-10-14",
  publisher: "Scholastic Press",
  page_count: 374,
  book_format: BookFormat.HARDCOVER,
  book_language: "English",
};

export const invalidEditionInput = {
  INVALID_ISBN: "123456",
  INVALID_DATE: "December",
};
