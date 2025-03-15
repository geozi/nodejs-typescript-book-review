import { Request } from "express";
import { User } from "models/user.model";
import bcrypt from "bcryptjs";
import { RoleType } from "resources/enums/roleType.enum";
import { IUser } from "interfaces/documents/iUser.interface";
import { IUserUpdate } from "interfaces/secondary/iUserUpdate.interface";
import { IRequest } from "interfaces/secondary/iRequest.interface";

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

export const reqBodyToUserUpdate = async (req: IRequest) => {
  const { username, email, password } = req.body;

  const user = req.user;

  const userToUpdate: IUserUpdate = {
    id: user._id,
    username: username,
    email: email,
  };

  const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;
  userToUpdate.password = hashedPassword;

  return userToUpdate;
};
