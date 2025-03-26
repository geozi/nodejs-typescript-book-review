import { AppDataSource } from "config/dataSource";
import { Book } from "entities/Book";
import {
  getBookByTitle,
  getBookById,
  addBook,
  updateBook,
  getBooksByGenre,
} from "repositories/bookRepository";
import sinon, { SinonStub } from "sinon";
import { invalidBookInputs, validBookInputs } from "../../tests/testInputs";
import assert from "assert";
import { ServerError } from "errors/serverErrorClass";
import { ValidationError } from "class-validator";
import { IBookUpdate } from "interfaces/IBookUpdate";
import { UpdateResult } from "typeorm";
import { Genre } from "resources/enum/Genre";
import { Author } from "entities/Author";

describe("Book repository unit tests", () => {
  let findOneByStub: SinonStub;
  let findByStub: SinonStub;
  let saveStub: SinonStub;
  let updateStub: SinonStub;
  let mockBook: Book;
  let mockId: number;
  let mockAuthor: Author;

  describe(`${getBooksByGenre.name}`, () => {
    let genre: Genre;
    let mockBooks: Book[];

    beforeEach(() => {
      // Reset stubs and mocks
      sinon.restore();

      // Stubs
      findByStub = sinon.stub(AppDataSource.getRepository(Book), "findBy");

      genre = Genre.FICTION;
    });

    it("Promise resolves to Book[]", async () => {
      mockBooks = [new Book(), new Book()];
      findByStub.resolves(mockBooks);

      const retrievedBooks = await getBooksByGenre(genre);

      assert.notStrictEqual(retrievedBooks, null);
      assert.strictEqual(retrievedBooks?.length, 2);
    });

    it("Promise resolves to null", async () => {
      mockBooks = [];
      findByStub.resolves(mockBooks);

      const retrievedBooks = await getBooksByGenre(genre);

      assert.strictEqual(retrievedBooks, null);
    });

    it("Promise rejects -> ServerError", async () => {
      findByStub.rejects();

      try {
        await getBooksByGenre(genre);
      } catch (error) {
        assert(error instanceof ServerError);
      }
    });
  });

  describe(`${getBookByTitle.name}`, () => {
    let title: string;

    beforeEach(() => {
      // Reset stubs and mocks
      sinon.restore();

      // Stubs
      findOneByStub = sinon.stub(
        AppDataSource.getRepository(Book),
        "findOneBy"
      );

      // Mocks
      mockBook = new Book();
      mockBook.title = validBookInputs.title;
      title = validBookInputs.title;
    });

    it(`Promise resolves to Book object`, async () => {
      findOneByStub.resolves(mockBook);

      const book = await getBookByTitle(title);

      assert.notStrictEqual(book, null);
      assert(book instanceof Book);
    });

    it("Promise resolves to null", async () => {
      findOneByStub.resolves(null);

      const book = await getBookByTitle(title);

      assert.strictEqual(book, null);
    });

    it("Promise rejects -> ServerError", async () => {
      findOneByStub.rejects();
      try {
        await getBookByTitle(title);
      } catch (error) {
        assert(error instanceof ServerError);
      }
    });
  });

  describe(`${getBookById.name}`, () => {
    beforeEach(() => {
      // Reset stubs and mocks
      sinon.restore();

      // Stubs
      findOneByStub = sinon.stub(
        AppDataSource.getRepository(Book),
        "findOneBy"
      );

      // Mocks
      mockId = 1;
      mockBook = new Book();
      mockBook.id = mockId;
    });

    it("Promise resolves to Book object", async () => {
      findOneByStub.resolves(mockBook);

      const book = await getBookById(mockId);

      assert.notStrictEqual(book, null);
      assert(book instanceof Book);
    });

    it("Promise resolves to null", async () => {
      findOneByStub.resolves(null);

      const book = await getBookById(mockId);

      assert.strictEqual(book, null);
    });

    it("Promise rejects -> ServerError", async () => {
      findOneByStub.rejects();

      try {
        await getBookById(mockId);
      } catch (error) {
        assert(error instanceof ServerError);
      }
    });
  });

  describe(`${addBook.name}`, () => {
    beforeEach(() => {
      // Reset stubs and mocks
      sinon.restore();

      // Stubs
      saveStub = sinon.stub(AppDataSource.getRepository(Book), "save");

      // Mocks
      mockAuthor = new Author();
      mockBook = new Book();
      mockBook.title = validBookInputs.title;
      mockBook.genre = validBookInputs.genre;
      mockBook.authors = [];
      mockBook.authors.push(mockAuthor);
    });

    it("Promise resolves to Book object", async () => {
      saveStub.resolves(mockBook);

      const savedBook = await addBook(mockBook);

      assert(savedBook instanceof Book);
      assert.strictEqual(savedBook.authors[0].id, mockAuthor.id);
    });

    it("Promise rejects -> ValidationError", async () => {
      mockBook.title = invalidBookInputs.TITLE_TOO_SHORT;

      try {
        await addBook(mockBook);
      } catch (error) {
        assert(error instanceof ValidationError);
      }
    });

    it("Promise rejects -> ServerError", async () => {
      saveStub.rejects();

      try {
        await addBook(mockBook);
      } catch (error) {
        assert(error instanceof ServerError);
      }
    });
  });

  describe(`${updateBook.name}`, () => {
    let mockDataObject: IBookUpdate;
    let mockUpdateResult: UpdateResult;

    beforeEach(() => {
      // Reset stubs and mocks
      sinon.restore();

      // Stubs
      updateStub = sinon.stub(AppDataSource.getRepository(Book), "update");
      findOneByStub = sinon.stub(
        AppDataSource.getRepository(Book),
        "findOneBy"
      );

      // Mocks
      mockUpdateResult = new UpdateResult();
      mockDataObject = { title: validBookInputs.title };
      mockId = 1;
      mockBook = new Book();
      mockBook.id = mockId;
      mockBook.title = validBookInputs.title;
    });

    it("Promise resolves to Book object", async () => {
      mockUpdateResult.affected = 1;
      updateStub.resolves(mockUpdateResult);
      findOneByStub.resolves(mockBook);

      const updatedBook = await updateBook(mockId, mockDataObject);

      assert(updatedBook instanceof Book);
      assert.strictEqual(updatedBook.title, mockBook.title);
    });

    it("Promise resolves to null", async () => {
      mockUpdateResult.affected = 0;
      updateStub.resolves(mockUpdateResult);

      const updatedBook = await updateBook(mockId, mockDataObject);

      assert.strictEqual(updatedBook, null);
    });

    it("Promise rejects -> ServerError", async () => {
      updateStub.rejects();

      try {
        await updateBook(mockId, mockDataObject);
      } catch (error) {
        assert(error instanceof ServerError);
      }
    });
  });
});
