import { NotFoundError } from "errors/notFoundErrorClass";
import { ServerError } from "errors/serverErrorClass";
import { Request, Response } from "express";
import { appLogger } from "logs/loggerConfig";
import {
  recastReqToIReq,
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

export const callReviewAddition = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const reqAsIRequest = recastReqToIReq(req);
    const newReview = reqBodyToReview(reqAsIRequest);
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

export const callReviewRetrievalByUsername = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const reqAsIRequest = recastReqToIReq(req);
    const username = reqAsIRequest.user.username;
    const retrievedReviews = await getReviewsByUsername(username);

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
