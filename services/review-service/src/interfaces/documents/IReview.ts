import { Document } from "mongoose";

export interface IReview extends Document {
  subject: string;
  description: string;
  book: {
    id: number;
  };
}
