import assert from "assert";
import { callAuthorUpdate } from "controllers/authorController";
import { AppDataSource } from "db/dataSource";
import { Author } from "entities/Author";
import { Request, Response } from "express";
import { authorControllerResponseMessages } from "messages/response/authorControllerResponseMessages";
import { commonResponseMessages } from "messages/response/commonResponseMessages";
import { apiVersionNumbers } from "resources/codes/apiVersionNumbers";
import { httpCodes } from "resources/codes/responseStatusCodes";
import sinon, { SinonSpy, SinonStub } from "sinon";
import { validAuthorInputs } from "tests/testInputs";
import { UpdateResult } from "typeorm";

describe("Author update integration tests", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusStub: SinonStub;
  let jsonSpy: SinonSpy;
  let setHeaderStub: SinonStub;
  let updateFuncStub: SinonStub;
  let findOneByStub: SinonStub;
  let mockUpdateResult: UpdateResult;
  let mockAuthor: Author;
  let mockId: number;

  describe("Positive scenarios", () => {
    beforeEach(() => {
      // Reset stubs, spies, and mocks
      sinon.restore();

      // Stubs and spies
      updateFuncStub = sinon.stub(
        AppDataSource.getRepository(Author),
        "update"
      );
      findOneByStub = sinon.stub(
        AppDataSource.getRepository(Author),
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
      mockAuthor = new Author();
      mockAuthor.id = Number(mockId).valueOf();
      mockAuthor.firstName = validAuthorInputs.firstName;
    });

    it("ok (200)", async () => {
      updateFuncStub.resolves(mockUpdateResult);
      findOneByStub.resolves(mockAuthor);

      req = {
        body: JSON.parse(
          JSON.stringify({
            id: mockId,
            firstName: validAuthorInputs.firstName,
          })
        ),
      };

      await callAuthorUpdate(req as Request, res as Response);

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
          message: authorControllerResponseMessages.AUTHOR_UPDATED,
          data: mockAuthor,
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
      updateFuncStub = sinon.stub(
        AppDataSource.getRepository(Author),
        "update"
      );
      findOneByStub = sinon.stub(
        AppDataSource.getRepository(Author),
        "findOneBy"
      );
      res = {
        status: sinon.stub().callsFake(() => res) as unknown as SinonStub,
        json: sinon.spy(),
      };

      // Mocks
      mockUpdateResult = new UpdateResult();

      req = {
        body: JSON.parse(
          JSON.stringify({
            id: mockId,
            firstName: validAuthorInputs.firstName,
          })
        ),
      };
    });

    it("server error (500) -> update rejects", async () => {
      updateFuncStub.rejects();

      await callAuthorUpdate(req as Request, res as Response);

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

    it("server error(500) -> findOneBy rejects", async () => {
      mockUpdateResult.affected = 1;
      updateFuncStub.resolves(mockUpdateResult);
      findOneByStub.rejects();

      await callAuthorUpdate(req as Request, res as Response);

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

      await callAuthorUpdate(req as Request, res as Response);

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
