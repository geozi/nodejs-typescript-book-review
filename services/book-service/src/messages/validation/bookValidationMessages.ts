import { bookConstants } from "resources/constants/bookConstants";
import { Genre } from "resources/enum/Genre";

export const bookFailedValidation = {
  TITLE_REQUIRED_MESSAGE: "Title is a required field",
  TITLE_NOT_STRING_MESSAGE: "Title field must be a string",
  TITLE_BELOW_MIN_LENGTH_MESSAGE: `Title field must be at least ${bookConstants.TITLE_MIN_LENGTH} characters long`,
  TITLE_ABOVE_MAX_LENGTH_MESSAGE: `Title field must be no longer than ${bookConstants.TITLE_MAX_LENGTH} characters long`,
  GENRE_REQUIRED_MESSAGE: "Genre is a required field",
  GENRE_INVALID_MESSAGE: `Genre field must be one of the following: ${Genre.DRAMA}, ${Genre.FICTION}, ${Genre.NON_FICTION}, ${Genre.POETRY}`,
  BOOK_ID_REQUIRED_MESSAGE: "Book ID is a required field",
  BOOK_ID_INVALID_MESSAGE: "Book ID must be a number",
};
