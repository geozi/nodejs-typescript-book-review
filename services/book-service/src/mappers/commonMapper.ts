import { Request } from "express";

export const reqBodyToId = (req: Request): number => {
  const { id } = req.body;
  return Number(id).valueOf();
};
