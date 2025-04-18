/**
 * User repository.
 * @module src/repositories/userRepository
 */
import { NotFoundError } from "errors/notFoundErrorClass";
import { ServerError } from "errors/serverErrorClass";
import { IUser } from "interfaces/documents/IUser";
import { IUserUpdate } from "interfaces/secondary/IUserUpdate";
import { appLogger } from "logs/loggerConfig";
import { commonResponseMessages } from "messages/response/commonResponseMessages";
import { userControllerResponseMessages } from "messages/response/userControllerResponseMessages";
import { User } from "models/User";
import { Error } from "mongoose";

/**
 * Returns a user with the specified username.
 *
 * @param {string} username - The username of a user.
 * @returns {Promise<IUser>} A promise that resolves to an {@link IUser} object.
 * @throws - {@link NotFoundError}
 */
export const getUserByUsername = async (username: string): Promise<IUser> => {
  try {
    const requestedUser = await User.findOne({ username: username });

    if (requestedUser === null) {
      throw new NotFoundError(
        userControllerResponseMessages.USER_NOT_FOUND_MESSAGE
      );
    }

    return requestedUser;
  } catch (error) {
    if (error instanceof NotFoundError) {
      appLogger.error(
        `User repository: ${getUserByUsername.name} -> ${error.name} thrown`
      );

      throw error;
    }

    appLogger.error(
      `User repository: ${getUserByUsername.name} -> ServerError thrown`
    );

    throw new ServerError(commonResponseMessages.SERVER_ERROR_MESSAGE);
  }
};

/**
 * Adds a new user to the database.
 *
 * @param {IUser} newUser - The new information to be persisted.
 * @returns {Promise<IUser>} A promise that resolves to an {@link IUser} object representing the newly saved document.
 */
export const addUser = async (newUser: IUser): Promise<IUser> => {
  try {
    const savedUser = await newUser.save();
    return savedUser;
  } catch (error) {
    if (error instanceof Error.ValidationError) {
      appLogger.error(
        `User repository: ${addUser.name} -> ${error.name} detected and re-thrown`
      );

      throw error;
    }

    appLogger.error(`User repository: ${addUser.name} -> ServerError thrown`);

    throw new ServerError(commonResponseMessages.SERVER_ERROR_MESSAGE);
  }
};

/**
 * Updates the information of an existing user in the database.
 *
 * @param {IUserUpdate} updateDataObject - The new information to be persisted.
 * @returns {Promise<IUser>} A promise that resolves to an {@link IUser} object representing the updated document.
 * @throws - {@link NotFoundError}
 */
export const updateUser = async (
  updateDataObject: IUserUpdate
): Promise<IUser> => {
  try {
    const { id, email, password } = { ...updateDataObject };
    const userToUpdate = {
      email: email,
      password: password,
    };

    const updatedUser = await User.findByIdAndUpdate(id, userToUpdate, {
      new: true,
      runValidators: true,
      context: "query",
    });

    if (updatedUser === null) {
      throw new NotFoundError(
        userControllerResponseMessages.USER_NOT_FOUND_MESSAGE
      );
    }

    return updatedUser;
  } catch (error) {
    if (error instanceof NotFoundError) {
      appLogger.error(
        `User repository: ${updateUser.name} -> ${error.name} thrown`
      );

      throw error;
    }

    appLogger.error(
      `User repository: ${updateUser.name} -> ServerError thrown`
    );

    throw new ServerError(commonResponseMessages.SERVER_ERROR_MESSAGE);
  }
};
