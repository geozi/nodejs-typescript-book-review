import { reviewConstants } from "resources/constants/reviewConstants";

export const reviewFailedValidation = {
  TITLE_REQUIRED_MESSAGE: "Title is a required field",
  TITLE_BELOW_MIN_LENGTH_MESSAGE: `Title must be at least ${reviewConstants.TITLE_MIN_LENGTH} characters long`,
  TITLE_ABOVE_MAX_LENGTH_MESSAGE: `Title must be no longer than ${reviewConstants.TITLE_MAX_LENGTH} characters long`,
  DESCRIPTION_REQUIRED_MESSAGE: "Description is a required field",
  DESCRIPTION_BELOW_MIN_LENGTH_MESSAGE: `Description must be at least ${reviewConstants.DESCRIPTION_MIN_LENGTH} characters long`,
  DESCRIPTION_ABOVE_MAX_LENGTH_MESSAGE: `Description must be no longer than ${reviewConstants.DESCRIPTION_MAX_LENGTH} characters long`,
  BOOK_ID_REQUIRED_MESSAGE: "Book ID is a required field",
  BOOK_ID_NEGATIVE_MESSAGE: "Book ID must be a positive integer",
};
