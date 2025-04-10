import { NotFoundError } from "errors/notFoundErrorClass";
import { ServerError } from "errors/serverErrorClass";
import { IReview } from "interfaces/documents/IReview";
import { IBook } from "interfaces/secondary/IBook";
import { IReviewUpdate } from "interfaces/secondary/IReviewUpdate";
import { appLogger } from "logs/loggerConfig";
import { commonResponseMessages } from "messages/response/commonResponseMessages";
import { reviewResponseMessages } from "messages/response/reviewResponseMessages";
import { Review } from "models/Review";
import { Error, Types } from "mongoose";

export const addReview = async (newReview: IReview): Promise<IReview> => {
  try {
    const savedReview = await newReview.save();

    return savedReview;
  } catch (error) {
    if (error instanceof Error.ValidationError) {
      appLogger.error(
        `Review repository: ${addReview.name} -> ValidationError detected and re-thrown`
      );

      throw error;
    }

    appLogger.error(
      `Review repository: ${addReview.name} -> ServerError thrown`
    );

    throw new ServerError(commonResponseMessages.SERVER_ERROR_MESSAGE);
  }
};

export const updateReview = async (
  updateDataObject: IReviewUpdate
): Promise<IReview> => {
  try {
    const { id, subject, description, book } = { ...updateDataObject };

    const reviewToUpdate = {
      subject: subject,
      description: description,
      book: book,
    };

    const updatedReview = await Review.findByIdAndUpdate(id, reviewToUpdate, {
      new: true,
      runValidators: true,
      context: "query",
    });

    if (updatedReview === null) {
      throw new NotFoundError(reviewResponseMessages.REVIEW_NOT_FOUND);
    }

    return updatedReview;
  } catch (error) {
    if (error instanceof NotFoundError) {
      appLogger.error(
        `Review repository: ${updateReview.name} -> ${error.name} thrown`
      );

      throw error;
    }

    appLogger.error(
      `Review repository: ${updateReview.name} -> ServerError thrown`
    );

    throw new ServerError(commonResponseMessages.SERVER_ERROR_MESSAGE);
  }
};

export const getReviewById = async (id: Types.ObjectId): Promise<IReview> => {
  try {
    const retrievedReview = await Review.findById(id);
    if (retrievedReview === null) {
      throw new NotFoundError(reviewResponseMessages.REVIEW_NOT_FOUND);
    }

    return retrievedReview;
  } catch (error) {
    if (error instanceof NotFoundError) {
      appLogger.error(
        `Review repository: ${getReviewById.name} -> ${error.name} thrown`
      );

      throw error;
    }

    appLogger.error(
      `Review repository: ${getReviewById.name} -> ServerError thrown`
    );

    throw new ServerError(commonResponseMessages.SERVER_ERROR_MESSAGE);
  }
};

export const getReviewsByBook = async (book: IBook): Promise<IReview[]> => {
  try {
    const retrievedReviews = await Review.find({ "book.id": book });
    if (retrievedReviews.length === 0) {
      throw new NotFoundError(reviewResponseMessages.REVIEW_S_NOT_FOUND);
    }

    return retrievedReviews;
  } catch (error) {
    if (error instanceof NotFoundError) {
      appLogger.error(
        `Review repository: ${getReviewsByBook.name} -> ${error.name} thrown`
      );

      throw error;
    }

    appLogger.error(
      `Review repository: ${getReviewsByBook.name} -> ServerError thrown`
    );

    throw new ServerError(commonResponseMessages.SERVER_ERROR_MESSAGE);
  }
};
