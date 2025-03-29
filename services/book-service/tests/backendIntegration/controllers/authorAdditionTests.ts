import assert from "assert";
import { AppDataSource } from "config/dataSource";
import { callAuthorAddition } from "controllers/authorController";
import { Author } from "entities/Author";
import { Request, Response } from "express";
import { authorControllerResponseMessages } from "messages/response/authorControllerResponseMessages";
import { commonResponseMessages } from "messages/response/commonResponseMessages";
import { authorFailedValidation } from "messages/validation/authorValidationMessages";
import { apiVersionNumbers } from "resources/codes/apiVersionNumbers";
import { httpCodes } from "resources/codes/responseStatusCodes";
import sinon, { SinonSpy, SinonStub } from "sinon";
import { invalidAuthorInputs, validAuthorInputs } from "tests/testInputs";

describe("Author addition integration tests", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusStub: SinonStub;
  let jsonSpy: SinonSpy;
  let setHeaderStub: SinonStub;
  let mockAuthor: Author;
  let saveStub: SinonStub;

  describe("Positive scenarios", () => {
    beforeEach(() => {
      sinon.restore();
      saveStub = sinon.stub(AppDataSource.getRepository(Author), "save");

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
      saveStub.resolves(mockAuthor);

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

      saveStub = sinon.stub(AppDataSource.getRepository(Author), "save");

      res = {
        status: sinon.stub().callsFake(() => res) as unknown as SinonStub,
        json: sinon.spy(),
      };
    });

    it("validation error (400)", async () => {
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
      assert.strictEqual(
        jsonSpy.calledWith({
          minLength: authorFailedValidation.FIRST_NAME_BELOW_MIN_LENGTH_MESSAGE,
        }),
        true
      );
    });

    it("server error (500)", async () => {
      saveStub.rejects();

      req = {
        body: JSON.parse(
          JSON.stringify({
            firstName: validAuthorInputs.firstName,
            lastName: validAuthorInputs.lastName,
          })
        ),
      };

      await callAuthorAddition(req as Request, res as Response);

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
  });
});
