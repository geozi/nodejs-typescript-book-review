import { personConstants } from "resources/constants/personConstant";

export const personFailedValidation = {
  FIRST_NAME_REQUIRED_MESSAGE: "First name is a required field",
  FIRST_NAME_INVALID_MESSAGE: "First name must only contain letters",
  FIRST_NAME_BELOW_MIN_LENGTH_MESSAGE: `First name must be at least ${personConstants.NAME_MIN_LENGTH} characters long`,
  LAST_NAME_REQUIRED_MESSAGE: "Last name is a required field",
  LAST_NAME_INVALID_MESSAGE: "Last name must only contain letters",
  LAST_NAME_BELOW_MIN_LENGTH_MESSAGE: `Last name must be at least ${personConstants.NAME_MIN_LENGTH} characters long`,
  SSN_REQUIRED_MESSAGE: "SSN is a required field",
  SSN_INVALID_MESSAGE: `SSN must follow the format XXX-XX-XXXX, where X is a digit`,
  PHONE_NUMBER_REQUIRED_MESSAGE: "Phone number is a required field",
  PHONE_NUMBER_INVALID_MESSAGE: `Phone number must only contain digits and/or hyphens`,
  ADDRESS_REQUIRED_MESSAGE: "Address is a required field",
};
