/**
 * Full info repository.
 * @module src/repositories/fullInfoRepository
 */
import { AppDataSource } from "db/dataSource";
import { Book } from "entities/Book";
import { ServerError } from "errors/serverErrorClass";
import { appLogger } from "logs/loggerConfigs";
import { commonResponseMessages } from "messages/response/commonResponseMessages";

const bookRepository = AppDataSource.getRepository(Book);

/**
 * Returns the full information of a {@link Book} entity, including its
 * authors and editions.
 *
 * @param {number} id - The ID of a book.
 * @returns {Promise<Book | null>} A promise that resolves to a {@link Book} object or null.
 * @throws - {@link ServerError}
 */
export const getFullInfoBookById = async (id: number) => {
  try {
    const book = await bookRepository.findOne({
      where: { id: id },
      relations: ["authors", "editions"],
    });

    return book;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    appLogger.error(
      `Full info repository: ${getFullInfoBookById.name} -> ServerError thrown`
    );

    throw new ServerError(commonResponseMessages.SERVER_ERROR_MESSAGE);
  }
};
