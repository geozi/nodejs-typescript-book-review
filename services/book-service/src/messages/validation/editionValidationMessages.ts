import { editionConstants } from "resources/constants/editionConstants";
import { BookFormat } from "resources/enum/BookFormat";

export const editionFailedValidation = {
  ISBN_REQUIRED_MESSAGE: "Isbn is a required field",
  ISBN_INVALID_MESSAGE: "String must be a valid ISBN-13",
  PUBLICATION_DATE_REQUIRED_MESSAGE: "Publication date is a required field",
  PUBLICATION_DATE_INVALID_MESSAGE: `Publication date must be a valid date`,
  PUBLISHER_REQUIRED_MESSAGE: "Publisher name is a required field",
  PUBLISHER_NOT_STRING_MESSAGE: "Publisher field must be a string",
  PUBLISHER_BELOW_MIN_LENGTH_MESSAGE: `Publisher field must be at least ${editionConstants.PUBLISHER_MIN_LENGTH} characters long`,
  PUBLISHER_ABOVE_MAX_LENGTH_MESSAGE: `Publisher field must be no longer than ${editionConstants.PUBLISHER_MAX_LENGTH} characters long`,
  PAGE_COUNT_REQUIRED_MESSAGE: "Page count is a required field",
  PAGE_COUNT_INVALID_MESSAGE: "Page count must be an integer",
  PAGE_COUNT_NEGATIVE_MESSAGE: "Page count must be a positive number",
  PAGE_COUNT_MINIMUM_MESSAGE: `Page count must be at least ${editionConstants.MIN_PAGE_COUNT}`,
  BOOK_FORMAT_REQUIRED_MESSAGE: "Book format is a required field",
  BOOK_FORMAT_INVALID_MESSAGE: `Book format must be either ${BookFormat.EBOOK} or ${BookFormat.HARDCOVER}`,
  LANGUAGE_REQUIRED_MESSAGE: "Book language is a required field",
  LANGUAGE_NOT_STRING_MESSAGE: "Book language must be a string",
  LANGUAGE_INVALID_MESSAGE: "Book language must only contain letters",
  LANGUAGE_MIN_LENGTH_MESSAGE: `Book language must be at least ${editionConstants.LANGUAGE_MIN_LENGTH} characters long`,
};
