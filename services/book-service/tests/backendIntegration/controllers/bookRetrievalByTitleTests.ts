import assert from "assert";
import { callBookRetrievalByTitle } from "controllers/bookController";
import { AppDataSource } from "db/dataSource";
import { Book } from "entities/Book";
import { Request, Response } from "express";
import { bookControllerResponseMessages } from "messages/response/bookControllerResponseMessages";
import { commonResponseMessages } from "messages/response/commonResponseMessages";
import { apiVersionNumbers } from "resources/codes/apiVersionNumbers";
import { httpCodes } from "resources/codes/responseStatusCodes";
import sinon, { SinonSpy, SinonStub } from "sinon";
import { validBookInputs } from "tests/testInputs";

describe("Book retrieval by title integration tests", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusStub: SinonStub;
  let jsonSpy: SinonSpy;
  let setHeaderStub: SinonStub;
  let findOneByStub: SinonStub;
  let mockBook: Book;

  describe("Positive scenarios", () => {
    beforeEach(() => {
      // Reset stubs and spies
      sinon.restore();

      // Stubs and spies
      findOneByStub = sinon.stub(
        AppDataSource.getRepository(Book),
        "findOneBy"
      );
      res = {
        setHeader: sinon.stub().callsFake(() => res) as unknown as SinonStub,
        status: sinon.stub().callsFake(() => res) as unknown as SinonStub,
        json: sinon.spy(),
      };

      // Mocks
      mockBook = new Book();
      mockBook.title = validBookInputs.title;

      // HTTP request
      req = {
        body: JSON.parse(
          JSON.stringify({
            title: validBookInputs.title,
          })
        ),
      };
    });

    it("response code 200", async () => {
      findOneByStub.resolves(mockBook);

      await callBookRetrievalByTitle(req as Request, res as Response);

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

  describe("Negative scenarios", async () => {
    beforeEach(() => {
      // Reset stubs and spies
      sinon.restore();

      // Stubs and spies
      findOneByStub = sinon.stub(
        AppDataSource.getRepository(Book),
        "findOneBy"
      );
      res = {
        status: sinon.stub().callsFake(() => res) as unknown as SinonStub,
        json: sinon.spy(),
      };

      // Mocks
      mockBook = new Book();
      mockBook.title = validBookInputs.title;

      // HTTP request
      req = {
        body: JSON.parse(
          JSON.stringify({
            title: validBookInputs.title,
          })
        ),
      };
    });

    it("response code 500", async () => {
      findOneByStub.rejects();

      await callBookRetrievalByTitle(req as Request, res as Response);

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

    it("response code 404", async () => {
      findOneByStub.resolves(null);

      await callBookRetrievalByTitle(req as Request, res as Response);

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
