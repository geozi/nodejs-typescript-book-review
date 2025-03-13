import { Types } from "mongoose";

export interface IUserUpdate {
  id: Types.ObjectId;
  username?: string;
  email?: string;
  password?: string;
}
