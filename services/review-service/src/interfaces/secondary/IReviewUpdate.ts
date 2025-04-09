import { Types } from "mongoose";

export interface IReviewUpdate {
  id: Types.ObjectId;
  subject?: string;
  description?: string;
  book?: {
    id: number;
  };
}
