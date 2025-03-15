import { IUser } from "interfaces/documents/iUser.interface";
import { IUserUpdate } from "interfaces/secondary/iUserUpdate.interface";
import { User } from "models/user.model";
import { appLogger } from "../../logs/logger.config";
import { Error } from "mongoose";
import { commonResponseMessages } from "messages/response/commonResponse.message";
import { ServerError } from "errors/serverError.class";

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
  try {
    const savedUser = await newUser.save();

    appLogger.info(`User repository: ${addUser.name} called successfully`);

    return savedUser;
  } catch (error) {
    if (error instanceof Error.ValidationError) {
      appLogger.error(
        `User repository: ${addUser.name} -> ${error.name} detected and re-thrown`
      );

      throw error;
    }

    appLogger.error(`User repository: ${addUser.name} -> ServerError thrown`);

    throw new ServerError(commonResponseMessages.SERVER_ERROR);
  }
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
