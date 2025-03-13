import { Schema } from "mongoose";

export interface IUserUpdate {
  id: Schema.Types.ObjectId;
  username?: string;
  email?: string;
  password?: string;
}
