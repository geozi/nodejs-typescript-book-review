/**
 * Person model schema.
 * @module src/models/Person
 */
import { IPerson } from "interfaces/documents/IPerson";
import { personFailedValidation } from "messages/validation/personValidationMessages";
import { userFailedValidation } from "messages/validation/userValidationMessages";
import { model, Schema } from "mongoose";
import mongooseUniqueValidator from "mongoose-unique-validator";
import { personConstants } from "resources/constants/personConstants";
import {
  NAME_REGEX,
  PHONE_REGEX,
  SSN_REGEX,
} from "resources/regExp/validationRegExp";

/**
 * Person schema for persistence in MongoDB.
 *
 * @type {Schema<IPerson>}
 * @property {string} firstName - The first name of a person.
 * @property {string} lastName - The last name of a person.
 * @property {string} ssn - The social security number of a person.
 * @property {string} phoneNumber - The phone number of a person.
 * @property {Schema.Types.Mixed} address - The address of a person.
 * @property {string} username - The username assigned to a person.
 */
const personSchema = new Schema<IPerson>(
  {
    firstName: {
      type: String,
      required: [true, personFailedValidation.FIRST_NAME_REQUIRED_MESSAGE],
      minLength: [
        personConstants.NAME_MIN_LENGTH,
        personFailedValidation.FIRST_NAME_BELOW_MIN_LENGTH_MESSAGE,
      ],
      match: [NAME_REGEX, personFailedValidation.FIRST_NAME_INVALID_MESSAGE],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, personFailedValidation.LAST_NAME_REQUIRED_MESSAGE],
      minLength: [
        personConstants.NAME_MIN_LENGTH,
        personFailedValidation.LAST_NAME_BELOW_MIN_LENGTH_MESSAGE,
      ],
      match: [NAME_REGEX, personFailedValidation.LAST_NAME_INVALID_MESSAGE],
      trim: true,
    },
    ssn: {
      type: String,
      unique: true,
      required: [true, personFailedValidation.SSN_REQUIRED_MESSAGE],
      match: [SSN_REGEX, personFailedValidation.SSN_INVALID_MESSAGE],
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: [true, personFailedValidation.PHONE_NUMBER_REQUIRED_MESSAGE],
      match: [PHONE_REGEX, personFailedValidation.PHONE_NUMBER_INVALID_MESSAGE],
      trim: true,
    },
    address: {
      type: Schema.Types.Mixed,
      required: [true, personFailedValidation.ADDRESS_REQUIRED_MESSAGE],
    },
    username: {
      type: String,
      required: [true, userFailedValidation.USERNAME_REQUIRED_MESSAGE],
    },
  },
  {
    collection: "persons",
    timestamps: true,
  }
);

personSchema.plugin(mongooseUniqueValidator, {
  message: "{PATH} already exists in the database",
  type: "Error.ValidationError",
});

export const Person = model<IPerson>("Person", personSchema);
