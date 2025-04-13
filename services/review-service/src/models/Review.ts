/**
 * Review model schema.
 * @module src/models/Review
 */
import { IReview } from "interfaces/documents/IReview";
import { reviewFailedValidation } from "messages/validation/reviewValidationMessages";
import { Schema, model } from "mongoose";
import mongooseUniqueValidator from "mongoose-unique-validator";
import { reviewConstants } from "resources/constants/reviewConstants";

/**
 * Review schema for persistence in MongoDB.
 *
 * @type {Schema<IReview>}
 * @property {string} subject - The subject of a review.
 * @property {string} description - The description of a review.
 * @property {object} book - The book under review.
 * @property {number} book.id - The ID of the book under review.
 * @property {string} username - The username of the user adding the review.
 *
 */
const reviewSchema = new Schema<IReview>(
  {
    subject: {
      type: String,
      required: [true, reviewFailedValidation.SUBJECT_REQUIRED_MESSAGE],
      minLength: [
        reviewConstants.SUBJECT_MIN_LENGTH,
        reviewFailedValidation.SUBJECT_BELOW_MIN_LENGTH_MESSAGE,
      ],
      maxLength: [
        reviewConstants.SUBJECT_MAX_LENGTH,
        reviewFailedValidation.SUBJECT_ABOVE_MAX_LENGTH_MESSAGE,
      ],
      trim: true,
    },
    description: {
      type: String,
      required: [true, reviewFailedValidation.DESCRIPTION_REQUIRED_MESSAGE],
      minLength: [
        reviewConstants.DESCRIPTION_MIN_LENGTH,
        reviewFailedValidation.DESCRIPTION_BELOW_MIN_LENGTH_MESSAGE,
      ],
      maxLength: [
        reviewConstants.DESCRIPTION_MAX_LENGTH,
        reviewFailedValidation.DESCRIPTION_ABOVE_MAX_LENGTH_MESSAGE,
      ],
      trim: true,
    },
    book: {
      id: {
        type: Number,
        required: [true, reviewFailedValidation.BOOK_ID_REQUIRED_MESSAGE],
        validate: {
          validator: function (value: number) {
            return value > 0;
          },
          message: reviewFailedValidation.BOOK_ID_NEGATIVE_MESSAGE,
        },
      },
    },
    username: {
      type: String,
      required: [true, reviewFailedValidation.USERNAME_REQUIRED_MESSAGE],
      trim: true,
    },
  },
  {
    collection: "reviews",
    timestamps: true,
  }
);

reviewSchema.index({ title: 1, username: 1 }, { unique: true });
reviewSchema.plugin(mongooseUniqueValidator, {
  message: "{PATH} already exists in the database",
  type: "UniqueConstraintError",
});

export const Review = model<IReview>("Review", reviewSchema);
