import { BSONError } from "bson";
import { Request } from "express";
import { IBook } from "interfaces/secondary/IBook";
import { IReviewUpdate } from "interfaces/secondary/IReviewUpdate";
import { appLogger } from "logs/loggerConfig";
import { reviewFailedValidation } from "messages/validation/reviewValidationMessages";
import { Review } from "models/Review";
import { Types } from "mongoose";

export const reqBodyToReview = (req: Request) => {
  const { subject, description, book } = req.body;
  const bookToReview: IBook = {
    id: book.id,
  };

  const newReview = new Review({
    subject: subject,
    description: description,
    book: bookToReview,
  });

  return newReview;
};

export const reqBodyToReviewUpdate = (req: Request) => {
  try {
    const { id, subject, description, book } = req.body;
    if (!id || Number.isInteger(id)) {
      throw TypeError(reviewFailedValidation.REVIEW_ID_INVALID_MESSAGE);
    }

    const reviewToUpdate: IReviewUpdate = {
      id: new Types.ObjectId(id),
      subject: subject,
      description: description,
    };

    if (book && book.id) {
      reviewToUpdate.book = book;
    }

    return reviewToUpdate;
  } catch (error) {
    if (BSONError.isBSONError(error)) {
      appLogger.error(
        `Review mapper: ${reqBodyToReviewUpdate.name} -> ${error.name} thrown`
      );

      throw error;
    }

    appLogger.error(
      `Review mapper: ${reqBodyToReviewUpdate.name} -> TypeError thrown`
    );

    throw error;
  }
};

export const reqBodyToBook = (req: Request) => {
  const { book } = req.body;

  const bookForRetrieval: IBook = { id: book.id };

  return bookForRetrieval;
};

export const reqBodyToId = (req: Request) => {
  try {
    const { id } = req.body;
    if (!id || Number.isInteger(id)) {
      throw new TypeError(reviewFailedValidation.REVIEW_ID_INVALID_MESSAGE);
    }

    return new Types.ObjectId(id);
  } catch (error) {
    if (BSONError.isBSONError(error)) {
      appLogger.error(
        `Review mapper: ${reqBodyToId.name} -> ${error.name} thrown`
      );

      throw error;
    }

    appLogger.error(`Review mapper: ${reqBodyToId.name} -> TypeError thrown`);

    throw error;
  }
};
