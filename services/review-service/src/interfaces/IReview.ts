import { Document } from "mongoose";

export interface IReview extends Document {
  title: string;
  description: string;
  book: {
    id: number;
  };
}
