import { Author } from "entities/Author";
import { Request, Response } from "express";
import sinon, { SinonSpy, SinonStub } from "sinon";
import assert from "assert";
import { AppDataSource } from "config/dataSource";
import { invalidAuthorInputs, validAuthorInputs } from "../../testInputs";
import { callAuthorAddition } from "controllers/authorController";
import { apiVersionNumbers } from "resources/codes/apiVersionNumbers";
import { httpCodes } from "resources/codes/responseStatusCodes";
import { authorControllerResponseMessages } from "messages/response/authorControllerResponseMessages";

describe.only("Author controller integration tests", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusStub: SinonStub;
  let jsonSpy: SinonSpy;
  let setHeaderStub: SinonStub;
  let mockAuthor: Author;
  let functionStub: SinonStub;

  describe("Positive scenarios", () => {
    beforeEach(() => {
      sinon.restore();
      functionStub = sinon.stub(AppDataSource.getRepository(Author), "save");

      res = {
        setHeader: sinon.stub().callsFake(() => res) as unknown as SinonStub,
        status: sinon.stub().callsFake(() => res) as unknown as SinonStub,
        json: sinon.spy(),
      };

      req = {
        body: JSON.parse(
          JSON.stringify({
            firstName: validAuthorInputs.firstName,
            lastName: validAuthorInputs.lastName,
          })
        ),
      };

      mockAuthor = new Author();
      mockAuthor.firstName = validAuthorInputs.firstName;
      mockAuthor.lastName = validAuthorInputs.lastName;
    });

    it("created (201)", async () => {
      functionStub.resolves(mockAuthor);

      await callAuthorAddition(req as Request, res as Response);

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
      assert.strictEqual(statusStub.calledWith(httpCodes.CREATED), true);
      assert.strictEqual(
        jsonSpy.calledWith({
          message: authorControllerResponseMessages.AUTHOR_ADDED,
          data: mockAuthor,
        }),
        true
      );
    });
  });

  describe("Negative scenarios", () => {
    beforeEach(() => {
      sinon.restore();

      res = {
        setHeader: sinon.stub().callsFake(() => res) as unknown as SinonStub,
        status: sinon.stub().callsFake(() => res) as unknown as SinonStub,
        json: sinon.spy(),
      };
    });

    it.only("validation error (400)", async () => {
      req = {
        body: JSON.parse(
          JSON.stringify({
            firstName: invalidAuthorInputs.NAME_TOO_SHORT,
            lastName: validAuthorInputs.lastName,
          })
        ),
      };

      await callAuthorAddition(req as Request, res as Response);

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(statusStub.calledWith(httpCodes.BAD_REQUEST), true);
    });
  });
});
