/**
 * Review mapper.
 * @module src/mappers/reviewMapper
 */
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

/**
 * Checks if the value type is string.
 *
 * @param {unknown} value A value.
 * @returns {boolean} True if the value type is string, false otherwise.
 */
function isString(value: unknown): boolean {
  return typeof value === "string";
}

/**
 * Converts an {@link IRequest} object to an {@link IReview} object.
 *
 * @param {IRequest} req - An HTTP request.
 * @returns {IReview} An {@link IReview} object.
 */
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

/**
 * Converts a Request object to an {@link IReviewUpdate} object.
 *
 * @param {Request} req - An HTTP request.
 * @returns {IReviewUpdate} An {@link IReviewUpdate} object.
 * @throws - TypeError
 */
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

/**
 * Converts a Request object to an {@link IBook} object.
 *
 * @param {Request} req - An HTTP request.
 * @returns {IBook} An {@link IBook} object.
 */
export const reqBodyToBook = (req: Request): IBook => {
  const { book } = req.body;

  const bookForRetrieval: IBook = { id: book.id };

  return bookForRetrieval;
};

/**
 * Converts a Request object to a Types.ObjectId.
 *
 * @param {Request} req - An HTTP request.
 * @returns {Types.ObjectId} A Types.ObjectId.
 * @throws - TypeError
 */
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

/**
 * Converts a Request object to an {@link ICompositeIndex} object.
 *
 * @param {Request} req - An HTTP request.
 * @returns {ICompositeIndex} An {@link ICompositeIndex} object.
 */
export const reqBodyToICompositeIndex = (req: Request): ICompositeIndex => {
  const { subject, username } = req.body;

  const compositeIndex: ICompositeIndex = {
    subject: subject,
    username: username,
  };

  return compositeIndex;
};

/**
 * Converts a Request object to an {@link IRequest} object.
 *
 * @param {Request} req - An HTTP request.
 * @returns {IRequest} An {@link IRequest} object.
 */
export const recastReqToIReq = (req: Request): IRequest => {
  return req as IRequest;
};
