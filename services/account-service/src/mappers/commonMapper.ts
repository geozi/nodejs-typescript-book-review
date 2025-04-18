/**
 * Common mapper.
 * @module src/mappers/commonMapper
 */
import { Request } from "express";
import { IRequest } from "interfaces/secondary/IRequest";

/**
 * Converts an HTTP request to an {@link IRequest} object.
 *
 * @param {Request} req - An HTTP request object.
 * @returns {IRequest} An {@link IRequest} object.
 */
export const recastReqToIReq = function (req: Request): IRequest {
  return req as IRequest;
};
