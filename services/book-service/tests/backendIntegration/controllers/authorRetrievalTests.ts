import assert from "assert";
import { callAuthorRetrievalById } from "controllers/authorController";
import { AppDataSource } from "db/dataSource";
import { Author } from "entities/Author";
import { Request, Response } from "express";
import { authorControllerResponseMessages } from "messages/response/authorControllerResponseMessages";
import { commonResponseMessages } from "messages/response/commonResponseMessages";
import { apiVersionNumbers } from "resources/codes/apiVersionNumbers";
import { httpCodes } from "resources/codes/responseStatusCodes";
import sinon, { SinonSpy, SinonStub } from "sinon";

describe("Author retrieval integration tests", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusStub: SinonStub;
  let jsonSpy: SinonSpy;
  let setHeaderStub: SinonStub;
  let findOneByStub: SinonStub;
  let mockId: string;
  let mockAuthor: Author;

  describe("Positive scenarios", () => {
    beforeEach(() => {
      // Reset stubs and mocks
      sinon.restore();

      // Stubs
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
      mockId = "1";
      mockAuthor = new Author();
      mockAuthor.id = Number(mockId).valueOf();
    });

    it("ok (200)", async () => {
      findOneByStub.resolves(mockAuthor);

      req = {
        body: JSON.parse(
          JSON.stringify({
            id: mockId,
          })
        ),
      };

      await callAuthorRetrievalById(req as Request, res as Response);

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
          message: authorControllerResponseMessages.AUTHOR_RETRIEVED,
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
      findOneByStub = sinon.stub(
        AppDataSource.getRepository(Author),
        "findOneBy"
      );

      res = {
        status: sinon.stub().callsFake(() => res) as unknown as SinonStub,
        json: sinon.spy(),
      };

      // Mocks
      mockId = "1";
      mockAuthor = new Author();
      mockAuthor.id = Number(mockId).valueOf();

      req = {
        body: JSON.parse(
          JSON.stringify({
            id: mockId,
          })
        ),
      };
    });

    it("server error (500)", async () => {
      findOneByStub.rejects();

      await callAuthorRetrievalById(req as Request, res as Response);

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
      findOneByStub.resolves(null);

      await callAuthorRetrievalById(req as Request, res as Response);

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
