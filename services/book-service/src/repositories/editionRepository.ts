import { validate, ValidationError } from "class-validator";
import { AppDataSource } from "db/dataSource";
import { Book } from "entities/Book";
import { Edition } from "entities/Edition";
import { ServerError } from "errors/serverErrorClass";
import { IEditionUpdate } from "interfaces/IEditionUpdate";
import { appLogger } from "logs/loggerConfigs";
import { commonResponseMessages } from "messages/response/commonResponseMessages";

const editionRepository = AppDataSource.getRepository(Edition);

export const getEditionByISBN = async (
  isbn: string
): Promise<Edition | null> => {
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

export const getEditionsByBook = async (book: Book): Promise<Edition[]> => {
  try {
    return await editionRepository.findBy({ book: book });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    appLogger.error(
      `Edition repository: ${getEditionsByBook.name} -> ServerError thrown`
    );

    throw new ServerError(commonResponseMessages.SERVER_ERROR_MESSAGE);
  }
};

export const addEdition = async (newEdition: Edition): Promise<Edition> => {
  try {
    const errors = await validate(newEdition);
    if (errors.length > 0) {
      const constraintArray: (Record<string, string> | undefined)[] = [];
      errors.forEach((err) => constraintArray.push(err.constraints));
      const constraintObject = Object.assign({}, ...constraintArray);
      const validationError = new ValidationError();
      validationError.constraints = constraintObject;
      throw validationError;
    }

    return await editionRepository.save(newEdition);
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

export const updateEdition = async (
  id: number,
  updateObj: IEditionUpdate
): Promise<Edition | null> => {
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
