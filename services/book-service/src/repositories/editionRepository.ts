import { AppDataSource } from "config/dataSource";
import { Edition } from "entities/Edition";
import { ServerError } from "errors/serverErrorClass";
import { appLogger } from "../../logs/loggerConfigs";
import { commonResponseMessages } from "messages/response/commonResponseMessages";
import { Book } from "entities/Book";
import { validate, ValidationError } from "class-validator";
import { IEditionUpdate } from "interfaces/IEditionUpdate";

const editionRepository = AppDataSource.getRepository(Edition);

export const getEditionByISBN = async (isbn: string) => {
  try {
    return await editionRepository.findOneBy({ isbn: isbn });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    appLogger.error(
      `Edition repository: ${getEditionByISBN.name} -> ServerError thrown`
    );

    throw new ServerError(commonResponseMessages.SERVER_ERROR_MESSAGE);
  }
};

export const getEditionsByBook = async (book: Book) => {
  try {
    const retrievedEditions = await editionRepository.findBy({ book: book });
    if (retrievedEditions.length === 0) {
      return new Promise((resolve) => {
        resolve(null);
      });
    }

    return retrievedEditions;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    appLogger.error(
      `Edition repository: ${getEditionsByBook.name} -> ServerError thrown`
    );

    throw new ServerError(commonResponseMessages.SERVER_ERROR_MESSAGE);
  }
};

export const addEdition = async (newEdition: Edition) => {
  try {
    const errors = await validate(newEdition);
    if (errors.length > 0) {
      return new ValidationError();
    }

    return editionRepository.save(newEdition);
  } catch (error) {
    if (error instanceof ValidationError) {
      appLogger.error(
        `Edition repository: ${addEdition.name} -> ValidationError detected and re-thrown`
      );

      throw error;
    }

    appLogger.error(
      `Edition repository: ${addEdition.name} -> ServerError thrown`
    );

    throw new ServerError(commonResponseMessages.SERVER_ERROR_MESSAGE);
  }
};

export const updateEdition = async (id: number, updateObj: IEditionUpdate) => {
  try {
    const result = await editionRepository.update({ id: id }, updateObj);
    if (result.affected === 0) {
      return new Promise((resolve) => {
        resolve(null);
      });
    }

    return await editionRepository.findOneBy({ id: id });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    appLogger.error(
      `Edition repository: ${updateEdition.name} -> ServerError thrown`
    );

    throw new ServerError(commonResponseMessages.SERVER_ERROR_MESSAGE);
  }
};
