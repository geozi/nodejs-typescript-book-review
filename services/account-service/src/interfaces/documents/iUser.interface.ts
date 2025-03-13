import { Document } from "mongoose";
import { RoleType } from "resources/enums/roleType.enum";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: RoleType;
}
