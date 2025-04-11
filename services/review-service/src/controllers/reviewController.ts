import { ServerError } from "errors/serverErrorClass";
import { Request, Response } from "express";
import { appLogger } from "logs/loggerConfig";
import { recastReqToIReq, reqBodyToReview } from "mappers/reviewMapper";
import { commonResponseMessages } from "messages/response/commonResponseMessages";
import { reviewResponseMessages } from "messages/response/reviewResponseMessages";
import { Error } from "mongoose";
import { addReview } from "repositories/reviewRepository";
import { apiVersionNumbers } from "resources/codes/apiVersionNumbers";
import { httpCodes } from "resources/codes/responseStatusCodes";

export const callReviewAddition = async (req: Request, res: Response) => {
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
