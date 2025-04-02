/**
 * Author mapper.
 * @module src/mappers/authorMapper
 */
import { Author } from "entities/Author";
import { Request } from "express";
import { IAuthorUpdate } from "interfaces/IAuthorUpdate";

/**
 * Maps the body of a Request object to an {@link Author} object.
 *
 * @param {Request} req - An HTTP request.
 * @returns {Author} An {@link Author} object.
 */
export const reqBodyToAuthor = (req: Request): Author => {
  const { firstName, lastName } = req.body;

  const newAuthor = new Author();
  newAuthor.firstName = firstName;
  newAuthor.lastName = lastName;

  return newAuthor;
};

/**
 * Maps the body of a Request object to a custom data object.
 *
 * @param {Request} req - An HTTP request.
 * @returns A custom object containing an ID and an {@link IAuthorUpdate} object.
 */
export const reqBodyToAuthorUpdate = (
  req: Request
): { id: number; author: IAuthorUpdate } => {
  const { id, firstName, lastName } = req.body;

  const author: IAuthorUpdate = {};

  if (firstName) {
    author.firstName = firstName;
  }

  if (lastName) {
    author.lastName = lastName;
  }

  const data = {
    id: id,
    author: author,
  };

  return data;
};
