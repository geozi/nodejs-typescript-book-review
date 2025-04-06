import assert from "assert";
import { AppDataSource } from "db/dataSource";
import { Author } from "entities/Author";
import { Book } from "entities/Book";
import { Edition } from "entities/Edition";
import { getFullInfoBookById } from "repositories/fullInfoRepository";
import sinon, { SinonStub } from "sinon";
import { validBookInputs } from "tests/testInputs";

describe.only("Full info repository unit tests", () => {
  let findOneStub: SinonStub;
  let mockId: number;
  let mockBook: Book;

  describe(`${getFullInfoBookById.name}`, () => {
    beforeEach(() => {
      // Reset stubs and mocks
      sinon.restore();

      // Mocks
      mockId = 1;
      mockBook = new Book();
      mockBook.id = mockId;
      mockBook.title = validBookInputs.title;
      mockBook.genre = validBookInputs.genre;
      mockBook.authors = [new Author()];
      mockBook.editions = [new Edition()];

      // Stubs
      findOneStub = sinon.stub(AppDataSource.getRepository(Book), "findOne");
    });

    it("Promise resolves to Book", async () => {
      findOneStub.resolves(mockBook);

      const retrievedBook = await getFullInfoBookById(mockId);

      assert.notStrictEqual(retrievedBook, null);
      assert(retrievedBook instanceof Book);
    });
  });
});
