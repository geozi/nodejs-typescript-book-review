import { RoleType } from "resources/enum/RoleType";

export interface IUser {
  username: string;
  email: string;
  password: string;
  role: RoleType;
}
