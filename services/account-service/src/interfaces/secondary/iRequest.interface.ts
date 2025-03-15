import { Request } from "express";
import { IUser } from "interfaces/documents/iUser.interface";

export interface IRequest extends Request {
  user: IUser;
}
