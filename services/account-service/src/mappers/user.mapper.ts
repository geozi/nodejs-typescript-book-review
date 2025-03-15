import { Request } from "express";
import { User } from "models/user.model";
import bcrypt from "bcryptjs";
import { RoleType } from "resources/enums/roleType.enum";
import { IUser } from "interfaces/documents/iUser.interface";

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
