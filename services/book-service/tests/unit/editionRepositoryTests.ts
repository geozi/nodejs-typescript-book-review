import { AppDataSource } from "config/dataSource";
import { Book } from "entities/Book";
import { Edition } from "entities/Edition";
import sinon, { SinonStub } from "sinon";
import { validEditionInputs } from "../../tests/testInputs";
import {
  addEdition,
  getEditionByISBN,
  getEditionsByBook,
  updateEdition,
} from "repositories/editionRepository";
import assert from "assert";
import { ServerError } from "errors/serverErrorClass";
import { ValidationError } from "class-validator";
import { IEditionUpdate } from "interfaces/IEditionUpdate";
import { UpdateResult } from "typeorm";
import { BookFormat } from "resources/enum/BookFormat";

describe("Edition repository unit tests", () => {
  let findOneByStub: SinonStub;
  let findByStub: SinonStub;
  let saveStub: SinonStub;
  let updateStub: SinonStub;
  let mockBook: Book;
  let mockEdition: Edition;
  let mockEditions: Edition[];
  let mockDataObject: IEditionUpdate;
  let mockUpdateResult: UpdateResult;
  let mockId: number;

  describe(`${getEditionByISBN.name}`, () => {
    beforeEach(() => {
      // Reset stubs and mocks
      sinon.restore();

      // Stubs
      findOneByStub = sinon.stub(
        AppDataSource.getRepository(Edition),
        "findOneBy"
      );

      // Mocks
      mockBook = new Book();
      mockEdition = new Edition();
      mockEdition.isbn = validEditionInputs.isbn;
      mockEdition.publication_date = new Date(
        validEditionInputs.publication_date
      );
      mockEdition.publisher = validEditionInputs.publisher;
      mockEdition.page_count = validEditionInputs.page_count;
      mockEdition.book_format = BookFormat.HARDCOVER;
      mockEdition.book_language = validEditionInputs.book_language;
      mockEdition.book = mockBook;
    });

    it("Promise resolves to Edition object", async () => {
      findOneByStub.resolves(mockEdition);

      const retrievedEdition = await getEditionByISBN(validEditionInputs.isbn);

      assert.notStrictEqual(retrievedEdition, null);
      assert(retrievedEdition instanceof Edition);
      assert.strictEqual(retrievedEdition.book.id, mockBook.id);
    });

    it("Promise resolves to null", async () => {
      findOneByStub.resolves(null);

      const retrievedEdition = await getEditionByISBN(validEditionInputs.isbn);

      assert.strictEqual(retrievedEdition, null);
    });

    it("Promise rejects -> ServerError", async () => {
      findOneByStub.rejects();

      try {
        await getEditionByISBN(validEditionInputs.isbn);
      } catch (error) {
        assert(error instanceof ServerError);
      }
    });
  });

  describe(`${getEditionsByBook.name}`, () => {
    beforeEach(() => {
      // Reset stubs and mocks
      sinon.restore();

      // Stubs
      findByStub = sinon.stub(AppDataSource.getRepository(Edition), "findBy");

      // Mocks

      mockBook = new Book();
    });

    it("Promise resolves to Edition[]", async () => {
      mockEditions = [new Edition(), new Edition()];
      findByStub.resolves(mockEditions);

      const retrievedEditions = await getEditionsByBook(mockBook);

      assert.notStrictEqual(retrievedEditions, null);
      assert.strictEqual(retrievedEditions.length, 2);
    });

    it("Promise resolves to empty Edition[]", async () => {
      mockEditions = [];
      findByStub.resolves(mockEditions);

      const retrievedEditions = await getEditionsByBook(mockBook);

      assert.notStrictEqual(retrievedEditions, null);
      assert.strictEqual(retrievedEditions.length, 0);
    });

    it("Promise rejects -> ServerError", async () => {
      findByStub.rejects();

      try {
        await getEditionsByBook(mockBook);
      } catch (error) {
        assert(error instanceof ServerError);
      }
    });
  });

  describe(`${addEdition.name}`, () => {
    beforeEach(() => {
      // Reset stubs and mocks
      sinon.restore();

      // Stubs
      saveStub = sinon.stub(AppDataSource.getRepository(Edition), "save");

      // Mocks
      mockBook = new Book();
      mockEdition = new Edition();
      mockEdition.isbn = validEditionInputs.isbn;
      mockEdition.publication_date = new Date(
        validEditionInputs.publication_date
      );
      mockEdition.publisher = validEditionInputs.publisher;
      mockEdition.page_count = validEditionInputs.page_count;
      mockEdition.book_format = BookFormat.HARDCOVER;
      mockEdition.book_language = validEditionInputs.book_language;
      mockEdition.book = mockBook;
    });

    it("Promise resolves to Edition object", async () => {
      saveStub.resolves(mockEdition);

      const savedEdition = await addEdition(mockEdition);

      assert(savedEdition instanceof Edition);
      assert.strictEqual(savedEdition.book.id, mockBook.id);
    });

    it("Promise rejects -> ValidationError", async () => {
      mockEdition.isbn = "123";

      try {
        await addEdition(mockEdition);
      } catch (error) {
        assert(error instanceof ValidationError);
      }
    });

    it("Promise rejects -> ServerError", async () => {
      saveStub.rejects();

      try {
        await addEdition(mockEdition);
      } catch (error) {
        assert(error instanceof ServerError);
      }
    });
  });

  describe(`${updateEdition.name}`, () => {
    beforeEach(() => {
      // Reset stubs and mocks
      sinon.restore();

      // Stubs
      updateStub = sinon.stub(AppDataSource.getRepository(Edition), "update");
      findOneByStub = sinon.stub(
        AppDataSource.getRepository(Edition),
        "findOneBy"
      );

      // Mocks
      mockUpdateResult = new UpdateResult();
      mockDataObject = {
        publication_date: new Date(validEditionInputs.publication_date),
      };
      mockId = 1;
      mockEdition = new Edition();
      mockEdition.id = mockId;
      mockEdition.publication_date = new Date(
        validEditionInputs.publication_date
      );
    });

    it("Promise resolves to Edition object", async () => {
      mockUpdateResult.affected = 1;
      updateStub.resolves(mockUpdateResult);
      findOneByStub.resolves(mockEdition);

      const updatedEdition = await updateEdition(mockId, mockDataObject);

      assert(updatedEdition instanceof Edition);
      assert.strictEqual(updatedEdition.id, mockId);
      assert.deepEqual(
        updatedEdition.publication_date,
        mockDataObject.publication_date
      );
    });

    it("Promise resolves to null", async () => {
      mockUpdateResult.affected = 0;
      updateStub.resolves(mockUpdateResult);

      const updatedEdition = await updateEdition(mockId, mockDataObject);

      assert.strictEqual(updatedEdition, null);
    });

    it("Promise rejects in update -> ServerError", async () => {
      updateStub.rejects();

      try {
        await updateEdition(mockId, mockDataObject);
      } catch (error) {
        assert(error instanceof ServerError);
      }
    });

    it("Promise rejects in findOneBy -> ServerError", async () => {
      mockUpdateResult.affected = 1;
      updateStub.resolves(mockUpdateResult);
      findOneByStub.rejects();

      try {
        await updateEdition(mockId, mockDataObject);
      } catch (error) {
        assert(error instanceof ServerError);
      }
    });
  });
});
