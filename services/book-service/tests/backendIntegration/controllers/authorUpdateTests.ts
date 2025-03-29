import assert from "assert";
import { AppDataSource } from "config/dataSource";
import { callAuthorUpdate } from "controllers/authorController";
import { Author } from "entities/Author";
import { Request, Response } from "express";
import { authorControllerResponseMessages } from "messages/response/authorControllerResponseMessages";
import { commonResponseMessages } from "messages/response/commonResponseMessages";
import { apiVersionNumbers } from "resources/codes/apiVersionNumbers";
import { httpCodes } from "resources/codes/responseStatusCodes";
import sinon, { SinonSpy, SinonStub } from "sinon";
import { UpdateResult } from "typeorm";
import { validAuthorInputs } from "../../testInputs";

describe("Author update tests", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusStub: SinonStub;
  let jsonSpy: SinonSpy;
  let setHeaderStub: SinonStub;
  let updateFuncStub: SinonStub;
  let findOneByStub: SinonStub;
  let mockUpdateResult: UpdateResult;
  let mockAuthor: Author;

  describe("Positive scenarios", () => {
    beforeEach(() => {
      // Reset stubs and mocks
      sinon.restore();

      // Stubs
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
      mockUpdateResult = new UpdateResult();
      mockUpdateResult.affected = 1;
      mockAuthor = new Author();
      mockAuthor.id = 1;
      mockAuthor.firstName = validAuthorInputs.firstName;
    });

    it("ok (200)", async () => {
      updateFuncStub.resolves(mockUpdateResult);
      findOneByStub.resolves(mockAuthor);

      req = {
        body: JSON.parse(
          JSON.stringify({
            id: 1,
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
          "X-api-version",
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
      // Reset stubs and mocks
      sinon.restore();

      // Stubs
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
    });

    it("server error (500) -> update rejects", async () => {
      updateFuncStub.rejects();

      req = {
        body: JSON.parse(
          JSON.stringify({
            id: 1,
            firstName: validAuthorInputs.firstName,
          })
        ),
      };

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
      updateFuncStub.resolves(mockUpdateResult);
      findOneByStub.rejects();

      req = {
        body: JSON.parse(
          JSON.stringify({
            id: 1,
            firstName: validAuthorInputs.firstName,
          })
        ),
      };

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

      req = {
        body: JSON.parse(
          JSON.stringify({
            id: 1,
            firstName: validAuthorInputs.firstName,
          })
        ),
      };

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
