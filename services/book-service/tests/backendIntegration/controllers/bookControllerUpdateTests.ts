import assert from "assert";
import { AppDataSource } from "config/dataSource";
import { callBookUpdate } from "controllers/bookController";
import { Book } from "entities/Book";
import { Request, Response } from "express";
import { bookControllerResponseMessages } from "messages/response/bookControllerResponseMessages";
import { commonResponseMessages } from "messages/response/commonResponseMessages";
import { apiVersionNumbers } from "resources/codes/apiVersionNumbers";
import { httpCodes } from "resources/codes/responseStatusCodes";
import { Genre } from "resources/enum/Genre";
import sinon, { SinonSpy, SinonStub } from "sinon";
import { UpdateResult } from "typeorm";
import { validBookInputs } from "../../testInputs";

describe.only("Book controller update tests", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusStub: SinonStub;
  let jsonSpy: SinonSpy;
  let setHeaderStub: SinonStub;
  let updateFuncStub: SinonStub;
  let findOneByStub: SinonStub;
  let mockUpdateResult: UpdateResult;
  let mockId: number;
  let mockBook: Book;

  describe("Positive scenarios", () => {
    beforeEach(() => {
      // Reset stubs and mocks
      sinon.restore();

      // Stubs
      updateFuncStub = sinon.stub(AppDataSource.getRepository(Book), "update");
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
      mockUpdateResult = new UpdateResult();
      mockUpdateResult.affected = 1;
      mockId = 1;
      mockBook = new Book();
      mockBook.id = mockId;
      mockBook.title = validBookInputs.title;
      mockBook.genre = Genre.FICTION;
    });

    it("ok (200)", async () => {
      updateFuncStub.resolves(mockUpdateResult);
      findOneByStub.resolves(mockBook);

      req = {
        body: JSON.parse(
          JSON.stringify({
            id: mockId,
            title: validBookInputs.title,
          })
        ),
      };

      await callBookUpdate(req as Request, res as Response);

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
          message: bookControllerResponseMessages.BOOK_UPDATED,
          data: mockBook,
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
      updateFuncStub = sinon.stub(AppDataSource.getRepository(Book), "update");
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
      mockId = 1;
      mockUpdateResult = new UpdateResult();
    });

    it("server error (500) -> update rejects", async () => {
      updateFuncStub.rejects();

      req = {
        body: JSON.parse(
          JSON.stringify({
            id: mockId,
            title: validBookInputs.title,
          })
        ),
      };

      await callBookUpdate(req as Request, res as Response);

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

    it("server error (500) -> findOneBy rejects", async () => {
      updateFuncStub.resolves(mockUpdateResult);
      findOneByStub.rejects();

      req = {
        body: JSON.parse(
          JSON.stringify({
            id: mockId,
            title: validBookInputs.title,
          })
        ),
      };

      await callBookUpdate(req as Request, res as Response);

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
      mockUpdateResult.affected = 0;
      updateFuncStub.resolves(mockUpdateResult);

      await callBookUpdate(req as Request, res as Response);

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
  });
});
