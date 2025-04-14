/**
 * Review controller.
 * @module src/controllers/reviewController
 */
import { NotFoundError } from "errors/notFoundErrorClass";
import { ServerError } from "errors/serverErrorClass";
import { Request, Response } from "express";
import { IReview } from "interfaces/documents/IReview";
import { appLogger } from "logs/loggerConfig";
import {
  reqBodyToBook,
  reqBodyToICompositeIndex,
  reqBodyToId,
  reqBodyToReview,
  reqBodyToReviewUpdate,
} from "mappers/reviewMapper";
import { commonResponseMessages } from "messages/response/commonResponseMessages";
import { reviewResponseMessages } from "messages/response/reviewResponseMessages";
import { Error } from "mongoose";
import {
  addReview,
  getReviewByCompositeIndex,
  getReviewById,
  getReviewsByBook,
  getReviewsByUsername,
  updateReview,
} from "repositories/reviewRepository";
import { apiVersionNumbers } from "resources/codes/apiVersionNumbers";
import { httpCodes } from "resources/codes/responseStatusCodes";

/**
 * Handles HTTP requests for review addition.
 * @param {Request} req - An HTTP request.
 * @param {Response} res - An HTTP response.
 * @returns {Promise<void>} A promise that resolves to void.
 */
export const callReviewAddition = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const newReview = reqBodyToReview(req);
    if (!newReview.username) {
      res.status(httpCodes.FORBIDDEN).json({});
      return;
    }
    const savedReview = await addReview(newReview);

    res
      .setHeader("x-api-version", apiVersionNumbers.VERSION_1_0)
      .status(httpCodes.CREATED)
      .json({
        message: reviewResponseMessages.REVIEW_CREATED_MESSAGE,
        data: savedReview,
      });
  } catch (error) {
    if (error instanceof Error.ValidationError) {
      appLogger.error(
        `Review controller: ${callReviewAddition.name} -> ${error.name} detected and caught`
      );

      res.status(httpCodes.BAD_REQUEST).json({
        message: commonResponseMessages.BAD_REQUEST_MESSAGE,
        errors: error.message,
      });
      return;
    }

    if (error instanceof ServerError) {
      appLogger.error(
        `Review controller: ${callReviewAddition.name} -> ${error.name} detected and caught`
      );

      res.status(error.httpCode).json({ message: error.message });
      return;
    }
  }
};

/**
 * Handles HTTP requests for review update.
 * @param {Request} req - An HTTP request.
 * @param {Response} res - An HTTP response.
 * @returns {Promise<void>} A promise that resolves to void.
 */
export const callReviewUpdate = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const reviewToUpdate = reqBodyToReviewUpdate(req);
    const updatedReview = await updateReview(reviewToUpdate);

    res
      .setHeader("x-api-version", apiVersionNumbers.VERSION_1_0)
      .status(httpCodes.OK)
      .json({
        message: reviewResponseMessages.REVIEW_UPDATE_MESSAGE,
        data: updatedReview,
      });
  } catch (error) {
    if (error instanceof ServerError || error instanceof NotFoundError) {
      appLogger.error(
        `Review controller: ${callReviewUpdate.name} -> ${error.name} detected and caught`
      );

      res.status(error.httpCode).json({ message: error.message });
      return;
    }
  }
};

/**
 * Handles HTTP requests for review retrieval by ID.
 * @param {Request} req - An HTTP request.
 * @param {Response} res - An HTTP response.
 * @returns {Promise<void>} A promise that resolves to void.
 */
export const callReviewRetrievalById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = reqBodyToId(req);
    const retrievedReview = await getReviewById(id);

    res
      .setHeader("x-api-version", apiVersionNumbers.VERSION_1_0)
      .status(httpCodes.OK)
      .json({
        message: reviewResponseMessages.REVIEW_RETRIEVED_MESSAGE,
        data: retrievedReview,
      });
  } catch (error) {
    if (error instanceof ServerError || error instanceof NotFoundError) {
      appLogger.error(
        `Review controller: ${callReviewRetrievalById.name} -> ${error.name} detected and caught`
      );

      res.status(error.httpCode).json({ message: error.message });
      return;
    }
  }
};

/**
 * Handles HTTP requests for review retrieval by book.
 * @param {Request} req - An HTTP request.
 * @param {Response} res - An HTTP response.
 * @returns {Promise<void>} A promise that resolves to void.
 */
export const callReviewRetrievalByBook = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const book = reqBodyToBook(req);
    const retrievedReviews = await getReviewsByBook(book);

    res
      .setHeader("x-api-version", apiVersionNumbers.VERSION_1_0)
      .status(httpCodes.OK)
      .json({
        message: reviewResponseMessages.REVIEW_S_RETRIEVED_MESSAGE,
        data: retrievedReviews,
      });
  } catch (error) {
    if (error instanceof ServerError || error instanceof NotFoundError) {
      appLogger.error(
        `Review controller: ${callReviewRetrievalByBook.name} -> ${error.name} detected and caught`
      );

      res.status(error.httpCode).json({ message: error.message });
      return;
    }
  }
};

/**
 * Handles HTTP requests for review retrieval by username.
 * @param {Request} req - An HTTP request.
 * @param {Response} res - An HTTP response.
 * @returns {Promise<void>} A promise that resolves to void.
 */
export const callReviewRetrievalByUsername = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    let retrievedReviews: IReview[];

    const username = req.get("x-user-name");
    if (!username) {
      res.status(httpCodes.FORBIDDEN).json({});
      return;
    } else {
      retrievedReviews = await getReviewsByUsername(username);
    }

    res
      .setHeader("x-api-version", apiVersionNumbers.VERSION_1_0)
      .status(httpCodes.OK)
      .json({
        message: reviewResponseMessages.REVIEW_S_RETRIEVED_MESSAGE,
        data: retrievedReviews,
      });
  } catch (error) {
    if (error instanceof ServerError || error instanceof NotFoundError) {
      appLogger.error(
        `Review controller: ${callReviewRetrievalByUsername.name} -> ${error.name} detected and caught`
      );

      res.status(error.httpCode).json({ message: error.message });
      return;
    }
  }
};

/**
 * Handles HTTP requests for review retrieval by composite index.
 * @param {Request} req - An HTTP request.
 * @param {Response} res - An HTTP response.
 * @returns {Promise<void>} A promise that resolves to void.
 */
export const callReviewRetrievalByIndex = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const compositeIndex = reqBodyToICompositeIndex(req);
    const retrievedReview = await getReviewByCompositeIndex(compositeIndex);

    res
      .setHeader("x-api-version", apiVersionNumbers.VERSION_1_0)
      .status(httpCodes.OK)
      .json({
        message: reviewResponseMessages.REVIEW_RETRIEVED_MESSAGE,
        data: retrievedReview,
      });
  } catch (error) {
    if (error instanceof ServerError || error instanceof NotFoundError) {
      appLogger.error(
        `Review controller: ${callReviewRetrievalByIndex.name} -> ${error.name} detected and caught`
      );

      res.status(error.httpCode).json({ message: error.message });
      return;
    }
  }
};
