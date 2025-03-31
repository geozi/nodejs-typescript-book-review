import assert from "assert";
import { callBookAuthorAddition } from "controllers/bookAuthorController";
import { AppDataSource } from "db/dataSource";
import { Author } from "entities/Author";
import { Book } from "entities/Book";
import { Request, Response } from "express";
import { authorControllerResponseMessages } from "messages/response/authorControllerResponseMessages";
import { bookAuthorControllerResponseMessages } from "messages/response/bookAuthorControllerResponseMessages";
import { bookControllerResponseMessages } from "messages/response/bookControllerResponseMessages";
import { commonResponseMessages } from "messages/response/commonResponseMessages";
import { apiVersionNumbers } from "resources/codes/apiVersionNumbers";
import { httpCodes } from "resources/codes/responseStatusCodes";
import sinon, { SinonSpy, SinonStub } from "sinon";
import { validAuthorInputs, validBookInputs } from "tests/testInputs";

describe("AuthorBook addition integration tests", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusStub: SinonStub;
  let jsonSpy: SinonSpy;
  let setHeaderStub: SinonStub;
  let bookFindOneByStub: SinonStub;
  let bookSaveStub: SinonStub;
  let authorFindOneByStub: SinonStub;
  let authorSaveStub: SinonStub;
  let mockBookId: string;
  let mockAuthorId: string;
  let mockBook: Book;
  let mockAuthor: Author;

  describe("Positive scenarios", () => {
    beforeEach(() => {
      // Reset stubs, spies, and mocks
      sinon.restore();

      // Stubs and spies
      bookFindOneByStub = sinon.stub(
        AppDataSource.getRepository(Book),
        "findOneBy"
      );
      bookSaveStub = sinon.stub(AppDataSource.getRepository(Book), "save");
      authorFindOneByStub = sinon.stub(
        AppDataSource.getRepository(Author),
        "findOneBy"
      );
      authorSaveStub = sinon.stub(AppDataSource.getRepository(Author), "save");
      res = {
        setHeader: sinon.stub().callsFake(() => res) as unknown as SinonStub,
        status: sinon.stub().callsFake(() => res) as unknown as SinonStub,
        json: sinon.spy(),
      };

      // Mocks
      mockBookId = "1";
      mockAuthorId = "1";
      mockBook = new Book();
      mockBook.id = Number(mockBookId).valueOf();
      mockBook.title = validBookInputs.title;
      mockBook.genre = validBookInputs.genre;
      mockAuthor = new Author();
      mockAuthor.id = Number(mockAuthorId).valueOf();
      mockAuthor.firstName = validAuthorInputs.firstName;
      mockAuthor.lastName = validAuthorInputs.lastName;

      req = {
        body: JSON.parse(
          JSON.stringify({
            bookId: mockBookId,
            authorId: mockAuthorId,
          })
        ),
      };
    });

    it("created (201)", async () => {
      bookFindOneByStub.resolves(mockBook);
      authorFindOneByStub.resolves(mockAuthor);
      bookSaveStub.resolves(mockBook);
      authorSaveStub.resolves(mockAuthor);

      await callBookAuthorAddition(req as Request, res as Response);

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;
      setHeaderStub = res.setHeader as SinonStub;

      assert.strictEqual(
        setHeaderStub.calledWith(
          "x-api-version",
          apiVersionNumbers.VERSION_1_0
        ),
        true
      );
      assert.strictEqual(statusStub.calledWith(httpCodes.CREATED), true);
      assert.strictEqual(
        jsonSpy.calledWith({
          message: bookAuthorControllerResponseMessages.RECORD_ADDED_MESSAGE,
        }),
        true
      );
    });
  });

  describe("Negative scenarios", () => {
    beforeEach(() => {
      // Reset stubs, spies, and mocks
      sinon.restore();

      // Stubs and spies
      bookFindOneByStub = sinon.stub(
        AppDataSource.getRepository(Book),
        "findOneBy"
      );
      bookSaveStub = sinon.stub(AppDataSource.getRepository(Book), "save");
      authorFindOneByStub = sinon.stub(
        AppDataSource.getRepository(Author),
        "findOneBy"
      );
      authorSaveStub = sinon.stub(AppDataSource.getRepository(Author), "save");
      res = {
        status: sinon.stub().callsFake(() => res) as unknown as SinonStub,
        json: sinon.spy(),
      };

      // Mocks
      mockBookId = "1";
      mockAuthorId = "1";
      mockBook = new Book();
      mockBook.id = Number(mockBookId).valueOf();
      mockBook.title = validBookInputs.title;
      mockBook.genre = validBookInputs.genre;
      mockAuthor = new Author();
      mockAuthor.id = Number(mockAuthorId).valueOf();
      mockAuthor.firstName = validAuthorInputs.firstName;
      mockAuthor.lastName = validAuthorInputs.lastName;

      req = {
        body: JSON.parse(
          JSON.stringify({
            bookId: mockBookId,
            authorId: mockAuthorId,
          })
        ),
      };
    });

    it("server error (500) -> findOneBy (bookId) rejects", async () => {
      bookFindOneByStub.rejects();

      await callBookAuthorAddition(req as Request, res as Response);

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(
        statusStub.calledWith(httpCodes.INTERNAL_SERVER_ERROR),
        true
      );
      assert.strictEqual(
        jsonSpy.calledWith({
          message: commonResponseMessages.SERVER_ERROR_MESSAGE,
        }),
        true
      );
    });

    it("server error (500) -> findOneBy (authorId) rejects", async () => {
      bookFindOneByStub.resolves(mockBook);
      authorFindOneByStub.rejects();

      await callBookAuthorAddition(req as Request, res as Response);

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(
        statusStub.calledWith(httpCodes.INTERNAL_SERVER_ERROR),
        true
      );
      assert.strictEqual(
        jsonSpy.calledWith({
          message: commonResponseMessages.SERVER_ERROR_MESSAGE,
        }),
        true
      );
    });

    it("server error (500) -> save (book) rejects", async () => {
      bookFindOneByStub.resolves(mockBook);
      authorFindOneByStub.resolves(mockAuthor);
      bookSaveStub.rejects();

      await callBookAuthorAddition(req as Request, res as Response);

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(
        statusStub.calledWith(httpCodes.INTERNAL_SERVER_ERROR),
        true
      );
      assert.strictEqual(
        jsonSpy.calledWith({
          message: commonResponseMessages.SERVER_ERROR_MESSAGE,
        }),
        true
      );
    });

    it("server error (500) -> save (author) rejects", async () => {
      bookFindOneByStub.resolves(mockBook);
      authorFindOneByStub.resolves(mockAuthor);
      bookSaveStub.resolves(mockBook);
      authorSaveStub.rejects();

      await callBookAuthorAddition(req as Request, res as Response);

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(
        statusStub.calledWith(httpCodes.INTERNAL_SERVER_ERROR),
        true
      );
      assert.strictEqual(
        jsonSpy.calledWith({
          message: commonResponseMessages.SERVER_ERROR_MESSAGE,
        }),
        true
      );
    });

    it("not found (404) -> findOneBy (bookId) returns null", async () => {
      bookFindOneByStub.resolves(null);

      await callBookAuthorAddition(req as Request, res as Response);

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(statusStub.calledWith(httpCodes.NOT_FOUND), true);
      assert.strictEqual(
        jsonSpy.calledWith({
          message: bookControllerResponseMessages.BOOK_NOT_FOUND,
        }),
        true
      );
    });

    it("not found (404) -> findOneBy (authorId) returns null", async () => {
      bookFindOneByStub.resolves(mockBook);
      authorFindOneByStub.resolves(null);

      await callBookAuthorAddition(req as Request, res as Response);

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(statusStub.calledWith(httpCodes.NOT_FOUND), true);
      assert.strictEqual(
        jsonSpy.calledWith({
          message: authorControllerResponseMessages.AUTHOR_NOT_FOUND,
        }),
        true
      );
    });
  });
});
