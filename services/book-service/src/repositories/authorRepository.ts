import { validate, ValidationError } from "class-validator";
import { AppDataSource } from "config/dataSource";
import { Author } from "entities/Author";
import { ServerError } from "errors/serverErrorClass";
import { IAuthorUpdate } from "interfaces/IAuthorUpdate";
import { appLogger } from "logs/loggerConfigs";
import { commonResponseMessages } from "messages/response/commonResponseMessages";

const authorRepository = AppDataSource.getRepository(Author);

export const getAuthorById = async (id: number): Promise<Author | null> => {
  try {
    return await authorRepository.findOneBy({ id: id });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    appLogger.error(
      `Author repository: ${getAuthorById.name}: ServerError thrown`
    );

    throw new ServerError(commonResponseMessages.SERVER_ERROR_MESSAGE);
  }
};

export const addAuthor = async (newAuthor: Author): Promise<Author> => {
  try {
    const errors = await validate(newAuthor);
    if (errors.length > 0) {
      const constraintArray: (Record<string, string> | undefined)[] = [];
      errors.forEach((err) => constraintArray.push(err.constraints));
      const constraintObject = Object.assign({}, ...constraintArray);
      const validationError = new ValidationError();
      validationError.constraints = constraintObject;
      throw validationError;
    }

    return await authorRepository.save(newAuthor);
  } catch (error) {
    if (error instanceof ValidationError) {
      appLogger.error(
        `Author repository: ${addAuthor.name} -> ValidationError detected and re-thrown`
      );

      throw error;
    }

    appLogger.error(
      `Author repository: ${addAuthor.name} -> ServerError thrown`
    );

    throw new ServerError(commonResponseMessages.SERVER_ERROR_MESSAGE);
  }
};

export const updateAuthor = async (
  id: number,
  updateObj: IAuthorUpdate
): Promise<Author | null> => {
  try {
    const result = await authorRepository.update({ id: id }, updateObj);
    if (result.affected === 0) {
      return new Promise((resolve) => {
        resolve(null);
      });
    }

    return await authorRepository.findOneBy({ id: id });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    appLogger.error(
      `Author repository: ${updateAuthor.name} -> ServerError thrown`
    );

    throw new ServerError(commonResponseMessages.SERVER_ERROR_MESSAGE);
  }
};
