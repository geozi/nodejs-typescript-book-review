import { IUser } from "interfaces/documents/iUser.interface";
import { IUserUpdate } from "interfaces/secondary/iUserUpdate.interface";
import { User } from "models/user.model";
import { appLogger } from "../../logs/logger.config";

export const getUserByUsername = async (
  username: string
): Promise<IUser | null> => {
  const requestedUser = await User.findOne({ username: username });

  appLogger.info(
    `User repository: ${getUserByUsername.name} called successfully`
  );

  return requestedUser;
};

export const addUser = async (newUser: IUser): Promise<IUser> => {
  const savedUser = await newUser.save();

  appLogger.info(`User repository: ${addUser.name} called successfully`);

  return savedUser;
};

export const updateUser = async (
  updateDataObject: IUserUpdate
): Promise<IUser | null> => {
  const { id, username, email, password } = { ...updateDataObject };
  const userToUpdate = { username: username, email: email, password: password };

  const updatedUser = await User.findByIdAndUpdate(id, userToUpdate, {
    new: true,
    runValidators: true,
    context: "query",
  });

  appLogger.info(`User repository: ${updateUser.name} called successfully`);

  return updatedUser;
};
