import { Request } from "express";
import { IRequest } from "interfaces/secondary/iRequest.interface";

export const recastReqToIReq = function (req: Request) {
  return req as IRequest;
};
