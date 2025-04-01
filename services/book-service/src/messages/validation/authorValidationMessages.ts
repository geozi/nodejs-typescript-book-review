import { authorConstants } from "resources/constants/authorConstants";

export const authorFailedValidation = {
  FIRST_NAME_REQUIRED_MESSAGE: "First name is a required field",
  FIRST_NAME_NOT_STRING_MESSAGE: "First name must be a string",
  FIRST_NAME_INVALID_MESSAGE: "First name must only contain letters",
  FIRST_NAME_BELOW_MIN_LENGTH_MESSAGE: `First name must be at least ${authorConstants.NAME_MIN_LENGTH} characters long`,
  LAST_NAME_REQUIRED_MESSAGE: "Last name is a required field",
  LAST_NAME_NOT_STRING_MESSAGE: "Last name must be a string",
  LAST_NAME_INVALID_MESSAGE: "Last name must only contain letters",
  LAST_NAME_BELOW_MIN_LENGTH_MESSAGE: `Last name must be at least ${authorConstants.NAME_MIN_LENGTH} characters long`,
  AUTHOR_ID_REQUIRED_MESSAGE: "Author ID is a required field",
  AUTHOR_ID_INVALID_MESSAGE: "Author ID must be number",
};
