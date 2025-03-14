import { Types } from "mongoose";
import { IAddress } from "./iAddress.interface";

export interface IPersonUpdate {
  id: Types.ObjectId;
  firstName?: string;
  lastName?: string;
  ssn?: string;
  phoneNumber?: string;
  address?: IAddress;
  username: string;
}
