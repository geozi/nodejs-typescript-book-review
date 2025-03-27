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
): (number | IAuthorUpdate)[] => {
  const { id, firstName, lastName } = req.body;

  const idAsNumber = new Number(id).valueOf();
  const author: IAuthorUpdate = {
    firstName: firstName,
    lastName: lastName,
  };

  return [idAsNumber, author];
};
