import { IReview } from "interfaces/IReview";
import { reviewFailedValidation } from "messages/validation/reviewValidationMessages";
import { Schema, model } from "mongoose";
import { reviewConstants } from "resources/constants/reviewConstants";

const reviewSchema = new Schema<IReview>(
  {
    title: {
      type: String,
      required: [true, reviewFailedValidation.TITLE_REQUIRED_MESSAGE],
      minLength: [
        reviewConstants.TITLE_MIN_LENGTH,
        reviewFailedValidation.TITLE_BELOW_MIN_LENGTH_MESSAGE,
      ],
      maxLength: [
        reviewConstants.TITLE_MAX_LENGTH,
        reviewFailedValidation.TITLE_ABOVE_MAX_LENGTH_MESSAGE,
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
  },
  {
    collection: "reviews",
    timestamps: true,
  }
);

export const Review = model<IReview>("Review", reviewSchema);
