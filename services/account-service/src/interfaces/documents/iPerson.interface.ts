import { IAddress } from "interfaces/secondary/iAddress.interface";
import { Document } from "mongoose";

export interface IPerson extends Document {
  firstName: string;
  lastName: string;
  ssn: string;
  phoneNumber: string;
  address: IAddress;
  username: string;
}
