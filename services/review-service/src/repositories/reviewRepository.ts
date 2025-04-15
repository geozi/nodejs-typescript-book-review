/**
 * Review repository.
 * @module src/repositories/reviewRepository
 */
import { NotFoundError } from "errors/notFoundErrorClass";
import { ServerError } from "errors/serverErrorClass";
import { IReview } from "interfaces/documents/IReview";
import { IBook } from "interfaces/secondary/IBook";
import { ICompositeIndex } from "interfaces/secondary/ICompositeIndex";
import { IReviewUpdate } from "interfaces/secondary/IReviewUpdate";
import { appLogger } from "logs/loggerConfig";
import { commonResponseMessages } from "messages/response/commonResponseMessages";
import { reviewResponseMessages } from "messages/response/reviewResponseMessages";
import { Review } from "models/Review";
import { Error, Types } from "mongoose";

/**
 * Adds a new review to the database.
 *
 * @param {IReview} newReview - The new review to be persisted.
 * @returns {Promise<IReview>} A promise that resolves to an {@link IReview} object representing the newly persisted review.
 */
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

/**
 * Updates a review in the database.
 *
 * @param {IReviewUpdate} updateDataObject - An {@link IReviewUpdate} object representing the new information to be persisted.
 * @returns {Promise<IReview>} A promise that resolves to an {@link IReview} object representing the newly updated review.
 * @throws - {@link NotFoundError}
 */
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
      throw new NotFoundError(reviewResponseMessages.REVIEW_NOT_FOUND_MESSAGE);
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

/**
 * Returns the review with the specified ID.
 *
 * @param {Types.ObjectId} id - The ID of a review.
 * @returns {Promise<IReview>} A promise that resolves to an {@link IReview} object representing the requested review.
 * @throws - {@link NotFoundError}
 */
export const getReviewById = async (id: Types.ObjectId): Promise<IReview> => {
  try {
    const retrievedReview = await Review.findById(id);
    if (retrievedReview === null) {
      throw new NotFoundError(reviewResponseMessages.REVIEW_NOT_FOUND_MESSAGE);
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

/**
 * Returns the reviews of the specified book.
 *
 * @param {IBook} book - An {@link IBook} object representing the book under review.
 * @returns {Promise<IReview[]>} A promise that resolves to an array of {@link IReview} objects representing the requested reviews.
 * @throws - {@link NotFoundError}
 */
export const getReviewsByBook = async (book: IBook): Promise<IReview[]> => {
  try {
    const retrievedReviews = await Review.find({ book: book });
    if (retrievedReviews.length === 0) {
      throw new NotFoundError(
        reviewResponseMessages.REVIEW_S_NOT_FOUND_MESSAGE
      );
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
/**
 * Returns the reviews with the specified username.
 *
 * @param {string} username - The username of a user adding a review.
 * @returns {Promise<IReview[]>} A promise that resolves to an array of {@link IReview} objects representing the requested reviews.
 * @throws - {@link NotFoundError}
 */
export const getReviewsByUsername = async (
  username: string
): Promise<IReview[]> => {
  try {
    const retrievedReviews = await Review.find({ username: username });
    if (retrievedReviews.length === 0) {
      throw new NotFoundError(
        reviewResponseMessages.REVIEW_S_NOT_FOUND_MESSAGE
      );
    }

    return retrievedReviews;
  } catch (error) {
    if (error instanceof NotFoundError) {
      appLogger.error(
        `Review repository: ${getReviewsByUsername.name} -> ${error.name} thrown`
      );

      throw error;
    }

    appLogger.error(
      `Review repository: ${getReviewsByUsername.name} -> ServerError thrown`
    );

    throw new ServerError(commonResponseMessages.SERVER_ERROR_MESSAGE);
  }
};

/**
 * Returns the review with the specified composite index.
 *
 * @param {ICompositeIndex} compositeIndex - An {@link ICompositeIndex} object.
 * @returns {Promise<IReview>} A promise that resolves to an {@link IReview} object representing the requested review.
 * @throws - {@link NotFoundError}
 */
export const getReviewByCompositeIndex = async (
  compositeIndex: ICompositeIndex
): Promise<IReview> => {
  try {
    const retrievedReview = await Review.findOne(compositeIndex);
    if (retrievedReview === null) {
      throw new NotFoundError(reviewResponseMessages.REVIEW_NOT_FOUND_MESSAGE);
    }

    return retrievedReview;
  } catch (error) {
    if (error instanceof NotFoundError) {
      appLogger.error(
        `Review repository: ${getReviewByCompositeIndex.name} -> ${error.name} thrown`
      );

      throw error;
    }

    appLogger.error(
      `Review repository: ${getReviewByCompositeIndex.name} -> ServerError thrown`
    );

    throw new ServerError(commonResponseMessages.SERVER_ERROR_MESSAGE);
  }
};
