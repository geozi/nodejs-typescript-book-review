import { commonConstants } from "resources/constants/commonConstant";
import { userConstants } from "resources/constants/user.constant";
import { RoleType } from "resources/enums/roleType.enum";

export const userFailedValidation = {
  USERNAME_REQUIRED_MESSAGE: "Username is a required field",
  USERNAME_ABOVE_MAX_LENGTH_MESSAGE: `Username must be no longer than ${userConstants.USERNAME_MAX_LENGTH} characters`,
  USERNAME_BELOW_MIN_LENGTH_MESSAGE: `Username must be at least ${userConstants.USERNAME_MIN_LENGTH} characters long`,
  EMAIL_REQUIRED_MESSAGE: "Email is a required field",
  EMAIL_INVALID_MESSAGE: "User email is not valid",
  PASSWORD_REQUIRED_MESSAGE: "Password is a required field",
  PASSWORD_BELOW_MIN_LENGTH_MESSAGE: `Password must be at least ${userConstants.PASSWORD_MIN_LENGTH} characters long`,
  PASSWORD_MUST_HAVE_CHARACTERS_MESSAGE: `Password must have at least: one lowercase character, one uppercase character, one number, and one special symbol`,
  ROLE_REQUIRED_MESSAGE: "Role is a required field",
  ROLE_INVALID_MESSAGE: `Role must be either one of the following: ${RoleType.Admin}, ${RoleType.User}`,
  USER_ID_REQUIRED_MESSAGE: "User ID is a required field",
  USER_ID_INVALID_MESSAGE: "User ID must be a string of hex characters",
  USER_ID_OUT_OF_LENGTH_MESSAGE: `User ID must be ${commonConstants.MONGODB_ID_LENGTH} characters long`,
};
