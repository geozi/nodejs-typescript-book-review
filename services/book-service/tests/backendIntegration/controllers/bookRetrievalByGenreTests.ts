import assert from "assert";
import { AppDataSource } from "config/dataSource";
import { callBookRetrievalByGenre } from "controllers/bookController";
import { Book } from "entities/Book";
import { Request, Response } from "express";
import { bookControllerResponseMessages } from "messages/response/bookControllerResponseMessages";
import { commonResponseMessages } from "messages/response/commonResponseMessages";
import { apiVersionNumbers } from "resources/codes/apiVersionNumbers";
import { httpCodes } from "resources/codes/responseStatusCodes";
import { Genre } from "resources/enum/Genre";
import sinon, { SinonSpy, SinonStub } from "sinon";

describe("Book retrieval by Genre tests", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusStub: SinonStub;
  let jsonSpy: SinonSpy;
  let setHeaderStub: SinonStub;
  let findByStub: SinonStub;
  let mockBook1: Book;
  let mockBook2: Book;
  let mockBooks: Book[];

  describe("Positive scenarios", () => {
    beforeEach(() => {
      // Reset stubs and mocks
      sinon.restore();

      // Stubs
      findByStub = sinon.stub(AppDataSource.getRepository(Book), "findBy");

      res = {
        setHeader: sinon.stub().callsFake(() => res) as unknown as SinonStub,
        status: sinon.stub().callsFake(() => res) as unknown as SinonStub,
        json: sinon.spy(),
      };

      // Mocks
      mockBook1 = new Book();
      mockBook1.genre = Genre.FICTION;
      mockBook2 = new Book();
      mockBook2.genre = Genre.FICTION;
      mockBooks = [mockBook1, mockBook2];
    });

    it("ok (200)", async () => {
      findByStub.resolves(mockBooks);

      req = {
        body: JSON.parse(
          JSON.stringify({
            genre: "Fiction",
          })
        ),
      };

      await callBookRetrievalByGenre(req as Request, res as Response);

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;
      setHeaderStub = res.setHeader as SinonStub;

      assert.strictEqual(
        setHeaderStub.calledWith(
          "X-api-version",
          apiVersionNumbers.VERSION_1_0
        ),
        true
      );
      assert.strictEqual(statusStub.calledWith(httpCodes.OK), true);
      assert.strictEqual(
        jsonSpy.calledWith({
          message: bookControllerResponseMessages.BOOK_S_RETRIEVED,
          data: mockBooks,
        }),
        true
      );
    });
  });

  describe("Negative scenarios", () => {
    beforeEach(() => {
      // Reset stubs and mocks
      sinon.restore();

      // Stubs
      findByStub = sinon.stub(AppDataSource.getRepository(Book), "findBy");

      res = {
        status: sinon.stub().callsFake(() => res) as unknown as SinonStub,
        json: sinon.spy(),
      };

      // Mocks
      mockBook1 = new Book();
      mockBook1.genre = Genre.FICTION;
      mockBook2 = new Book();
      mockBook2.genre = Genre.FICTION;
      mockBooks = [mockBook1, mockBook2];
    });

    it("server error (500)", async () => {
      findByStub.rejects();

      await callBookRetrievalByGenre(req as Request, res as Response);

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

    it("not found (404)", async () => {
      findByStub.resolves([]);

      await callBookRetrievalByGenre(req as Request, res as Response);

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(statusStub.calledWith(httpCodes.NOT_FOUND), true);
      assert.strictEqual(
        jsonSpy.calledWith({
          message: bookControllerResponseMessages.BOOK_S_NOT_FOUND,
        }),
        true
      );
    });
  });
});
