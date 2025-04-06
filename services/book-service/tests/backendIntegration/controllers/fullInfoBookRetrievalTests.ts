import assert from "assert";
import { callFullInfoBookRetrieval } from "controllers/bookController";
import { AppDataSource } from "db/dataSource";
import { Author } from "entities/Author";
import { Book } from "entities/Book";
import { Edition } from "entities/Edition";
import { Request, Response } from "express";
import { bookControllerResponseMessages } from "messages/response/bookControllerResponseMessages";
import { commonResponseMessages } from "messages/response/commonResponseMessages";
import { apiVersionNumbers } from "resources/codes/apiVersionNumbers";
import { httpCodes } from "resources/codes/responseStatusCodes";
import sinon, { SinonSpy, SinonStub } from "sinon";
import { validBookInputs } from "tests/testInputs";

describe("Full info book retrieval integration tests", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusStub: SinonStub;
  let jsonSpy: SinonSpy;
  let setHeaderStub: SinonStub;
  let findOneStub: SinonStub;
  let mockBook: Book;
  let mockId: number;

  describe("Positive scenarios", () => {
    beforeEach(() => {
      // Reset stubs, spies, and mocks
      sinon.restore();

      // Stubs and spies
      findOneStub = sinon.stub(AppDataSource.getRepository(Book), "findOne");
      res = {
        setHeader: sinon.stub().callsFake(() => res) as unknown as SinonStub,
        status: sinon.stub().callsFake(() => res) as unknown as SinonStub,
        json: sinon.spy(),
      };

      // Mocks
      mockId = 1;
      mockBook = new Book();
      mockBook.id = mockId;
      mockBook.title = validBookInputs.title;
      mockBook.title = validBookInputs.title;
      mockBook.genre = validBookInputs.genre;
      mockBook.authors = [new Author()];
      mockBook.editions = [new Edition()];
    });

    it("ok (200)", async () => {
      findOneStub.resolves(mockBook);

      req = {
        body: JSON.parse(
          JSON.stringify({
            id: mockId,
          })
        ),
      };

      await callFullInfoBookRetrieval(req as Request, res as Response);

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
      assert.strictEqual(statusStub.calledWith(httpCodes.OK), true);
      assert.strictEqual(
        jsonSpy.calledWith({
          message: bookControllerResponseMessages.BOOK_RETRIEVED_MESSAGE,
          data: mockBook,
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
      findOneStub = sinon.stub(AppDataSource.getRepository(Book), "findOne");
      res = {
        status: sinon.stub().callsFake(() => res) as unknown as SinonStub,
        json: sinon.spy(),
      };

      // Mocks
      mockId = 1;
      mockBook = new Book();
      mockBook.id = mockId;
      mockBook.title = validBookInputs.title;
      mockBook.title = validBookInputs.title;
      mockBook.genre = validBookInputs.genre;
      mockBook.authors = [new Author()];
      mockBook.editions = [new Edition()];

      req = {
        body: JSON.parse(
          JSON.stringify({
            id: mockId,
          })
        ),
      };
    });

    it("server error (500)", async () => {
      findOneStub.rejects();

      await callFullInfoBookRetrieval(req as Request, res as Response);

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
      findOneStub.resolves(null);

      await callFullInfoBookRetrieval(req as Request, res as Response);

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(statusStub.calledWith(httpCodes.NOT_FOUND), true);
      assert.strictEqual(
        jsonSpy.calledWith({
          message: bookControllerResponseMessages.BOOK_NOT_FOUND_MESSAGE,
        }),
        true
      );
    });
  });
});
