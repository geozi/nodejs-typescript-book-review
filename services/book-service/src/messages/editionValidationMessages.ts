import { editionConstants } from "resources/constants/editionConstants";
import { BookFormat } from "resources/enum/BookFormat";

export const editionFailedValidation = {
  ISBN_INVALID_MESSAGE: "String must be a valid ISBN-13",
  PUBLICATION_DATE_INVALID_MESSAGE: `Publication date must be a valid date`,
  PUBLISHER_BELOW_MIN_LENGTH_MESSAGE: `Publisher field must be at least ${editionConstants.PUBLISHER_MIN_LENGTH} characters long`,
  PUBLISHER_ABOVE_MAX_LENGTH_MESSAGE: `Publisher field must be no longer than ${editionConstants.PUBLISHER_MAX_LENGTH} characters long`,
  PAGE_COUNT_INVALID_MESSAGE: "Page count must be an integer",
  PAGE_COUNT_NEGATIVE_MESSAGE: "Page count must be a positive number",
  PAGE_COUNT_MINIMUM_MESSAGE: `Page count must be at least ${editionConstants.MIN_PAGE_COUNT}`,
  BOOK_FORMAT_INVALID_MESSAGE: `Book format must be either ${BookFormat.EBOOK} or ${BookFormat.HARDCOVER}`,
  LANGUAGE_MIN_LENGTH_MESSAGE: `Book language must be at least ${editionConstants.LANGUAGE_MIN_LENGTH} characters long`,
};
