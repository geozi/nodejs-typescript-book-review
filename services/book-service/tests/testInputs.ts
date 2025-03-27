export const validAuthorInputs = {
  firstName: "Lilah",
  lastName: "Wong",
};

export const invalidAuthorInputs = {
  NAME_INVALID: "12",
  NAME_TOO_SHORT: "a",
};

export const validEditionInputs = {
  isbn: "9780439023481",
  publication_date: "2008-10-14",
  publisher: "Scholastic Press",
  page_count: 374,
  book_format: "Hardcover",
  book_language: "English",
};

export const invalidEditionInputs = {
  INVALID_ISBN: "123456",
  INVALID_DATE: "December",
  PUBLISHER_NAME_TOO_SHORT: "p",
  PUBLISHER_NAME_TOO_LONG: `The International Society for the Promotion of Extremely Long and Impractical Titles Publishing House`,
  PAGE_COUNT_NEGATIVE: -1,
  PAGE_COUNT_MIN: 1,
  INVALID_BOOK_FORMAT: "Electronic",
  INVALID_LANGUAGE: "Engl1sh",
  LANGUAGE_TOO_SHORT: "u",
};

export const validBookInputs = {
  title: "The Hunger Games",
  genre: "Fiction",
};

export const invalidBookInputs = {
  TITLE_TOO_SHORT: "T",
  TITLE_TOO_LONG: `The Astonishing Chronicles of an Unlikely Hero Who Navigates a World of Endless Wonders and Unexpected Perils`,
  GENRE_INVALID: "Fun",
};
