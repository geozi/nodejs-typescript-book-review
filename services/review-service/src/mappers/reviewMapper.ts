import { BSONError } from "bson";
import { Request } from "express";
import { IReview } from "interfaces/documents/IReview";
import { IBook } from "interfaces/secondary/IBook";
import { ICompositeIndex } from "interfaces/secondary/ICompositeIndex";
import { IRequest } from "interfaces/secondary/IRequest";
import { IReviewUpdate } from "interfaces/secondary/IReviewUpdate";
import { appLogger } from "logs/loggerConfig";
import { reviewFailedValidation } from "messages/validation/reviewValidationMessages";
import { Review } from "models/Review";
import { Types } from "mongoose";

function isString(value: unknown): boolean {
  return typeof value === "string";
}

export const reqBodyToReview = (req: IRequest): IReview => {
  const { subject, description, book } = req.body;
  const user = req.user;
  const bookToReview: IBook = {
    id: book.id,
  };

  const newReview = new Review({
    subject: subject,
    description: description,
    book: bookToReview,
    username: user.username,
  });

  return newReview;
};

export const reqBodyToReviewUpdate = (req: Request): IReviewUpdate => {
  try {
    const { id, subject, description, book } = req.body;
    if (!id || !isString(id)) {
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

export const reqBodyToBook = (req: Request): IBook => {
  const { book } = req.body;

  const bookForRetrieval: IBook = { id: book.id };

  return bookForRetrieval;
};

export const reqBodyToId = (req: Request): Types.ObjectId => {
  try {
    const { id } = req.body;
    if (!id || !isString(id)) {
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

export const reqBodyToICompositeIndex = (req: IRequest): ICompositeIndex => {
  const { title } = req.body;
  const user = req.user;

  const compositeIndex: ICompositeIndex = {
    title: title,
    username: user.username,
  };

  return compositeIndex;
};

export const recastReqToIReq = (req: Request): IRequest => {
  return req as IRequest;
};
