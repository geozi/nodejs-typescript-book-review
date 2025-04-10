import { reviewConstants } from "resources/constants/reviewConstants";

export const reviewFailedValidation = {
  SUBJECT_REQUIRED_MESSAGE: "Title is a required field",
  SUBJECT_BELOW_MIN_LENGTH_MESSAGE: `Title must be at least ${reviewConstants.SUBJECT_MIN_LENGTH} characters long`,
  SUBJECT_ABOVE_MAX_LENGTH_MESSAGE: `Title must be no longer than ${reviewConstants.SUBJECT_MAX_LENGTH} characters long`,
  DESCRIPTION_REQUIRED_MESSAGE: "Description is a required field",
  DESCRIPTION_BELOW_MIN_LENGTH_MESSAGE: `Description must be at least ${reviewConstants.DESCRIPTION_MIN_LENGTH} characters long`,
  DESCRIPTION_ABOVE_MAX_LENGTH_MESSAGE: `Description must be no longer than ${reviewConstants.DESCRIPTION_MAX_LENGTH} characters long`,
  BOOK_REQUIRED_MESSAGE: "Book is a required field",
  BOOK_ID_REQUIRED_MESSAGE: "Book ID is a required field",
  BOOK_ID_INVALID_MESSAGE: "Book ID must be an integer",
  BOOK_ID_NEGATIVE_MESSAGE: "Book ID must be a positive integer",
  USERNAME_REQUIRED_MESSAGE: "Username is a required field",
  REVIEW_ID_REQUIRED_MESSAGE: "Review ID is a required field",
  REVIEW_ID_INVALID_MESSAGE: `Review ID must be a 24-character hex string`,
};
