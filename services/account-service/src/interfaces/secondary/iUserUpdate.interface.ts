import { Types } from "mongoose";

export interface IUserUpdate {
  id: Types.ObjectId;
  email?: string;
  password?: string;
}
