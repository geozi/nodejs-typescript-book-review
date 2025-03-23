import { authorConstants } from "resources/constants/authorConstants";

export const authorFailedValidation = {
  FIRST_NAME_INVALID: `First name must only contain letters`,
  FIRST_NAME_BELOW_MIN_LENGTH_MESSAGE: `First name must be at least ${authorConstants.NAME_MIN_LENGTH} characters long`,
  LAST_NAME_INVALID: `Last name must only contain letters`,
  LAST_NAME_BELOW_MIN_LENGTH_MESSAGE: `Last name must be at least ${authorConstants.NAME_MIN_LENGTH} characters long`,
};
