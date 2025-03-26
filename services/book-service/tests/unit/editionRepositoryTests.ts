import { AppDataSource } from "config/dataSource";
import { Book } from "entities/Book";
import { Edition } from "entities/Edition";
import sinon, { SinonStub } from "sinon";
import { validEditionInputs } from "../../tests/testInputs";
import {
  addEdition,
  getEditionByISBN,
  getEditionsByBook,
} from "repositories/editionRepository";
import assert from "assert";
import { ServerError } from "errors/serverErrorClass";
import { ValidationError } from "class-validator";

describe.only("Edition repository unit tests", () => {
  let findOneByStub: SinonStub;
  let findByStub: SinonStub;
  let saveStub: SinonStub;
  let mockBook: Book;
  let mockEdition: Edition;
  let mockEditions: Edition[];

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
      mockEdition.book_format = validEditionInputs.book_format;
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
      mockEdition.book_format = validEditionInputs.book_format;
      mockEdition.book_language = validEditionInputs.book_language;
      //mockEdition.book = mockBook;
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

    it.only("Promise rejects -> ServerError", async () => {
      saveStub.rejects();

      try {
        await addEdition(mockEdition);
      } catch (error) {
        console.log(error instanceof ServerError);
        //assert(error instanceof ServerError);
      }
    });
  });
});
