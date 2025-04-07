import { ServerError } from "errors/serverErrorClass";
import { IReview } from "interfaces/documents/IReview";
import { appLogger } from "logs/loggerConfig";
import { commonResponseMessages } from "messages/response/commonResponseMessages";
import { Error } from "mongoose";

export const addReview = async (newReview: IReview) => {
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
