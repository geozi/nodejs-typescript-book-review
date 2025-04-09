import { Request } from "express";
import { IBook } from "interfaces/secondary/IBook";
import { IReviewUpdate } from "interfaces/secondary/IReviewUpdate";
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
  const { id, subject, description, book } = req.body;

  const reviewToUpdate: IReviewUpdate = {
    id: new Types.ObjectId(id),
    subject: subject,
    description: description,
  };

  if (book && book.id) {
    reviewToUpdate.book = book;
  }

  return reviewToUpdate;
};

export const reqBodyToBook = (req: Request) => {
  const { book } = req.body;

  const bookForRetrieval: IBook = { id: book.id };

  return bookForRetrieval;
};

export const reqBodyToId = (req: Request) => {
  const { id } = req.body;

  return new Types.ObjectId(id);
};
