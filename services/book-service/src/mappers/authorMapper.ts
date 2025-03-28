import { Author } from "entities/Author";
import { Request } from "express";
import { IAuthorUpdate } from "interfaces/IAuthorUpdate";

export const reqBodyToAuthor = (req: Request): Author => {
  const { firstName, lastName } = req.body;

  const newAuthor = new Author();
  newAuthor.firstName = firstName;
  newAuthor.lastName = lastName;

  return newAuthor;
};

export const reqBodyToAuthorUpdate = (
  req: Request
): { id: number; author: IAuthorUpdate } => {
  const { id, firstName, lastName } = req.body;

  const idAsNumber = new Number(id).valueOf();
  const author: IAuthorUpdate = {};

  if (firstName) {
    author.firstName = firstName;
  }

  if (lastName) {
    author.lastName = lastName;
  }

  const data = {
    id: idAsNumber,
    author: author,
  };

  return data;
};
