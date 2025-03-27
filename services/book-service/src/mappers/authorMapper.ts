import { Author } from "entities/Author";
import { Request } from "express";
import { IAuthorUpdate } from "interfaces/IAuthorUpdate";

export const reqBodyToAuthor = (req: Request): Author => {
  const { firstName, lastName } = req.body;

  const newAuthor = new Author();
  newAuthor.first_name = firstName;
  newAuthor.last_name = lastName;

  return newAuthor;
};

export const reqBodyToAuthorUpdate = (
  req: Request
): (number | IAuthorUpdate)[] => {
  const { id, firstName, lastName } = req.body;

  const idAsNumber = new Number(id).valueOf();
  const author: IAuthorUpdate = {
    first_name: firstName,
    last_name: lastName,
  };

  return [idAsNumber, author];
};
