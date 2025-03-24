import { bookConstants } from "resources/constants/bookConstants";
import { Genre } from "resources/enum/Genre";

export const bookFailedValidation = {
  TITLE_BELOW_MIN_LENGTH_MESSAGE: `Title field must be at least ${bookConstants.TITLE_MIN_LENGTH} characters long`,
  TITLE_ABOVE_MAX_LENGTH_MESSAGE: `Title field must be no longer than ${bookConstants.TITLE_MAX_LENGTH} characters long`,
  GENRE_INVALID_MESSAGE: `Genre field must be one of the following: ${Genre.DRAMA}, ${Genre.FICTION}, ${Genre.NON_FICTION}, ${Genre.POETRY}`,
};
