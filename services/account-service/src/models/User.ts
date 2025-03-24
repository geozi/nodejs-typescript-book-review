/**
 * User model schema.
 * @module src/models/User
 */
import { IUser } from "interfaces/documents/IUser";
import { userFailedValidation } from "messages/validation/userValidationMessages";
import { model, Schema } from "mongoose";
import mongooseUniqueValidator from "mongoose-unique-validator";
import { userConstants } from "resources/constants/user.constant";
import { roleTypeArray } from "resources/enums/roleType.enum";
import { EMAIL_REGEX } from "resources/regExp/validationRegExp";

/**
 * User schema for persistence in MongoDB.
 *
 * @type {Schema<IUser>}
 * @property {string} username - The username of the user.
 * @property {string} email - The email of the user.
 * @property {string} password - The password of the user.
 * @property {string} role - The role of the user.
 */
const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      unique: true,
      required: [true, userFailedValidation.USERNAME_REQUIRED_MESSAGE],
      minLength: [
        userConstants.USERNAME_MIN_LENGTH,
        userFailedValidation.USERNAME_BELOW_MIN_LENGTH_MESSAGE,
      ],
      maxLength: [
        userConstants.USERNAME_MAX_LENGTH,
        userFailedValidation.USERNAME_ABOVE_MAX_LENGTH_MESSAGE,
      ],
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: [true, userFailedValidation.EMAIL_REQUIRED_MESSAGE],
      match: [EMAIL_REGEX, userFailedValidation.EMAIL_INVALID_MESSAGE],
      trim: true,
    },
    password: {
      type: String,
      required: [true, userFailedValidation.PASSWORD_REQUIRED_MESSAGE],
      trim: true,
    },
    role: {
      type: String,
      required: [true, userFailedValidation.ROLE_REQUIRED_MESSAGE],
      enum: {
        values: roleTypeArray,
        message: userFailedValidation.ROLE_INVALID_MESSAGE,
      },
    },
  },
  {
    collection: "users",
    timestamps: true,
  }
);

userSchema.plugin(mongooseUniqueValidator, {
  message: "{PATH} already exists in the database",
  type: "Error.ValidationError",
});

export const User = model<IUser>("User", userSchema);
