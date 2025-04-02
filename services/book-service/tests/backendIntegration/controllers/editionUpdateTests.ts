import assert from "assert";
import { callEditionUpdate } from "controllers/editionController";
import { AppDataSource } from "db/dataSource";
import { Book } from "entities/Book";
import { Edition } from "entities/Edition";
import { Request, Response } from "express";
import { bookControllerResponseMessages } from "messages/response/bookControllerResponseMessages";
import { commonResponseMessages } from "messages/response/commonResponseMessages";
import { editionControllerResponseMessages } from "messages/response/editionControllerResponseMessages";
import { apiVersionNumbers } from "resources/codes/apiVersionNumbers";
import { httpCodes } from "resources/codes/responseStatusCodes";
import sinon, { SinonSpy, SinonStub } from "sinon";
import { validEditionInputs } from "tests/testInputs";
import { UpdateResult } from "typeorm";

describe("Edition update integration tests", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusStub: SinonStub;
  let jsonSpy: SinonSpy;
  let setHeaderStub: SinonStub;
  let editionUpdateFuncStub: SinonStub;
  let bookFindOneByStub: SinonStub;
  let editionFindOneByStub: SinonStub;
  let mockUpdateResult: UpdateResult;
  let mockEdition: Edition;
  let mockId: number;
  let mockBook: Book;

  describe("Positive scenarios", () => {
    beforeEach(() => {
      // Reset stubs, spies, and mocks
      sinon.restore();

      // Stubs and spies
      editionUpdateFuncStub = sinon.stub(
        AppDataSource.getRepository(Edition),
        "update"
      );
      editionFindOneByStub = sinon.stub(
        AppDataSource.getRepository(Edition),
        "findOneBy"
      );
      res = {
        setHeader: sinon.stub().callsFake(() => res) as unknown as SinonStub,
        status: sinon.stub().callsFake(() => res) as unknown as SinonStub,
        json: sinon.spy(),
      };

      // Mocks
      mockId = 1;
      mockUpdateResult = new UpdateResult();
      mockUpdateResult.affected = 1;
      mockEdition = new Edition();
      mockEdition.id = mockId;
      mockEdition.pageCount = validEditionInputs.page_count;
    });

    it("ok (200)", async () => {
      editionUpdateFuncStub.resolves(mockUpdateResult);
      editionFindOneByStub.resolves(mockEdition);

      req = {
        body: JSON.parse(
          JSON.stringify({
            id: mockId,
            pageCount: validEditionInputs.page_count,
          })
        ),
      };

      await callEditionUpdate(req as Request, res as Response);

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
          message: editionControllerResponseMessages.EDITION_UPDATED_MESSAGE,
          data: mockEdition,
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
      editionUpdateFuncStub = sinon.stub(
        AppDataSource.getRepository(Edition),
        "update"
      );
      bookFindOneByStub = sinon.stub(
        AppDataSource.getRepository(Book),
        "findOneBy"
      );
      editionFindOneByStub = sinon.stub(
        AppDataSource.getRepository(Edition),
        "findOneBy"
      );
      res = {
        status: sinon.stub().callsFake(() => res) as unknown as SinonStub,
        json: sinon.spy(),
      };

      // Mocks
      mockId = 1;
      mockUpdateResult = new UpdateResult();
      mockBook = new Book();
      mockBook.id = mockId;

      req = {
        body: JSON.parse(
          JSON.stringify({
            id: mockId,
            pageCount: validEditionInputs.page_count,
            book: {
              id: mockId,
            },
          })
        ),
      };
    });

    it("server error (500) -> findOneBy (book) rejects", async () => {
      bookFindOneByStub.rejects();

      await callEditionUpdate(req as Request, res as Response);

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

    it("server error (500) -> update (edition) rejects", async () => {
      bookFindOneByStub.resolves(mockBook);
      editionUpdateFuncStub.rejects();

      await callEditionUpdate(req as Request, res as Response);

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

    it("server error (500) -> findOneBy (edition) rejects", async () => {
      bookFindOneByStub.resolves(mockBook);
      mockUpdateResult.affected = 1;
      editionUpdateFuncStub.resolves(mockUpdateResult);
      editionFindOneByStub.rejects();

      await callEditionUpdate(req as Request, res as Response);

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

    it("not found (404) -> findOneBy (book) returns null", async () => {
      bookFindOneByStub.resolves(null);

      await callEditionUpdate(req as Request, res as Response);

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

    it("not found (404) -> update (edition) returns 0", async () => {
      bookFindOneByStub.resolves(mockBook);
      mockUpdateResult.affected = 0;
      editionUpdateFuncStub.resolves(mockUpdateResult);

      await callEditionUpdate(req as Request, res as Response);

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(statusStub.calledWith(httpCodes.NOT_FOUND), true);
      assert.strictEqual(
        jsonSpy.calledWith({
          message: editionControllerResponseMessages.EDITION_NOT_FOUND_MESSAGE,
        }),
        true
      );
    });
  });
});
