import assert from "assert";
import { Request, Response } from "express";
import { authorFailedValidation } from "messages/validation/authorValidationMessages";
import { catchExpressValidationErrors } from "middleware/catchers/expressErrorCatcher";
import { authorRetrievalByIdRules } from "middleware/rules/authorRules";
import { httpCodes } from "resources/codes/responseStatusCodes";
import sinon, { SinonSpy, SinonStub } from "sinon";
import { invalidAuthorInputs, invalidCommonInputs } from "tests/testInputs";

describe("Author retrieval by ID rules: integration tests", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: SinonSpy;
  let statusStub: SinonStub;
  let jsonSpy: SinonSpy;
  const authorRetrievalByIdArray = [
    ...authorRetrievalByIdRules(),
    catchExpressValidationErrors,
  ];

  describe("Positive scenarios", () => {
    beforeEach(() => {
      // Reset stubs and spies
      sinon.restore();

      // Stubs and spies
      res = {
        status: sinon.stub().callsFake(() => {
          return res;
        }) as unknown as SinonStub,
        json: sinon.spy(),
      };
      next = sinon.spy();

      // HTTP request
      req = { body: JSON.parse(JSON.stringify({ id: 1 })) };
    });

    it("request has valid author ID", async () => {
      for (const middleware of authorRetrievalByIdArray) {
        await middleware(req as Request, res as Response, next);
      }

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(statusStub.notCalled, true);
      assert.strictEqual(jsonSpy.notCalled, true);
    });
  });

  describe("Negative scenarios", () => {
    beforeEach(() => {
      // Reset stubs and spies
      sinon.restore();

      // Stubs and spies
      res = {
        status: sinon.stub().callsFake(() => {
          return res;
        }) as unknown as SinonStub,
        json: sinon.spy(),
      };
      next = sinon.spy();

      // HTTP request
      req = { body: JSON.parse(JSON.stringify({})) };
    });

    it("author ID is undefined", async () => {
      req.body.id = undefined;

      for (const middleware of authorRetrievalByIdArray) {
        await middleware(req as Request, res as Response, next);
      }

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(statusStub.calledWith(httpCodes.BAD_REQUEST), true);
      assert.strictEqual(
        jsonSpy.calledWith({
          errors: [
            { message: authorFailedValidation.AUTHOR_ID_REQUIRED_MESSAGE },
          ],
        }),
        true
      );
    });

    it("author ID is invalid", async () => {
      req.body.id = invalidAuthorInputs.INVALID_AUTHOR_ID;

      for (const middleware of authorRetrievalByIdArray) {
        await middleware(req as Request, res as Response, next);
      }

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(statusStub.calledWith(httpCodes.BAD_REQUEST), true);
      assert.strictEqual(
        jsonSpy.calledWith({
          errors: [
            { message: authorFailedValidation.AUTHOR_ID_INVALID_MESSAGE },
          ],
        }),
        true
      );
    });

    it("author ID is negative", async () => {
      req.body.id = invalidCommonInputs.NEGATIVE_ID;

      for (const middleware of authorRetrievalByIdArray) {
        await middleware(req as Request, res as Response, next);
      }

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(statusStub.calledWith(httpCodes.BAD_REQUEST), true);
      assert.strictEqual(
        jsonSpy.calledWith({
          errors: [
            { message: authorFailedValidation.AUTHOR_ID_NEGATIVE_MESSAGE },
          ],
        }),
        true
      );
    });
  });
});
