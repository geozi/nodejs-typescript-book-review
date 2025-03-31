import { Request } from "express";

export const reqBodyToId = (req: Request): number => {
  const { id } = req.body;
  return Number(id).valueOf();
};

export const reqBodyToMultiIds = (
  req: Request
): { bookId: number; authorId: number } => {
  const { bookId, authorId } = req.body;
  return {
    bookId: Number(bookId).valueOf(),
    authorId: Number(authorId).valueOf(),
  };
};
