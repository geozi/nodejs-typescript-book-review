import { addressConstants } from "resources/constants/addressConstant";

export const addressFailedValidation = {
  STREET_NAME_REQUIRED_MESSAGE: "Street name is a required field",
  STREET_NAME_BELOW_MIN_LENGTH_MESSAGE: `Street name must be at least ${addressConstants.STREET_NAME_MIN_LENGTH} characters long`,
  RESIDENCE_NUMBER_REQUIRED_MESSAGE: "Residence number is a required field",
  RESIDENCE_NUMBER_INVALID_MESSAGE: "Residence number must be a number",
  RESIDENCE_NUMBER_NEGATIVE_MESSAGE: `Residence number must be a positive number`,
  ZIP_CODE_OUT_OF_LENGTH_MESSAGE: `Zip code must be ${addressConstants.ZIP_CODE_LENGTH} characters long`,
  ZIP_CODE_INVALID_MESSAGE: "Zip code must only contain digits",
  CITY_REQUIRED_MESSAGE: "City is a required field",
  CITY_INVALID_MESSAGE: `City must only contain letters and/or white spaces and/or hyphens`,
};
