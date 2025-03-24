/**
 * User mapper.
 * @module src/mappers/user.mapper
 */
import { Request } from "express";
import { User } from "models/user.model";
import bcrypt from "bcryptjs";
import { RoleType } from "resources/enums/roleType.enum";
import { IUser } from "interfaces/documents/IUser";
import { IUserUpdate } from "interfaces/secondary/IUserUpdate";
import { IRequest } from "interfaces/secondary/IRequest";

/**
 * Converts an HTTP request to an {@link IUser} object.
 *
 * @param {Request} req - An HTTP request.
 * @returns {Promise<IUser>} A promise that resolves to an {@link IUser} object.
 */
export const reqBodyToUser = async (req: Request): Promise<IUser> => {
  const { username, email, password, role } = req.body;
  const user = new User({
    username: username,
    email: email,
  });

  const hashedPassword = await bcrypt.hash(password, 10);
  user.password = hashedPassword;

  switch (role) {
    case RoleType.Admin.toString():
      user.role = RoleType.Admin;
      break;
    case RoleType.User.toString():
      user.role = RoleType.User;
      break;
  }

  return user;
};

/**
 * Converts an {@link IRequest} object to an {@link IUserUpdate} object.
 *
 * @param {IRequest} req - An HTTP request.
 * @returns {Promise<IUserUpdate>} A promise that resolves to an {@link IUserUpdate} object.
 */
export const reqBodyToUserUpdate = async (
  req: IRequest
): Promise<IUserUpdate> => {
  const { email, password } = req.body;
  const user = req.user;

  const userToUpdate: IUserUpdate = {
    id: user.id,
    email: email,
  };

  const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;
  userToUpdate.password = hashedPassword;

  return userToUpdate;
};
