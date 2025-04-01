import assert from "assert";
import { Request, Response } from "express";
import { editionFailedValidation } from "messages/validation/editionValidationMessages";
import { catchExpressValidationErrors } from "middleware/catchers/expressErrorCatcher";
import { editionRetrievalByIsbnRules } from "middleware/rules/editionRules";
import { httpCodes } from "resources/codes/responseStatusCodes";
import sinon, { SinonSpy, SinonStub } from "sinon";
import { invalidEditionInputs, validEditionInputs } from "tests/testInputs";

describe("Edition retrieval by ISBN integration tests", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: SinonSpy;
  let statusStub: SinonStub;
  let jsonSpy: SinonSpy;
  const editionRetrievalArray = [
    ...editionRetrievalByIsbnRules(),
    catchExpressValidationErrors,
  ];

  describe("Positive scenarios", () => {
    beforeEach(() => {
      // Reset stubs, mocks, and spies.
      sinon.restore();

      // Stubs and spies
      res = {
        status: sinon.stub().callsFake(() => {
          return res;
        }) as unknown as SinonStub,
        json: sinon.spy(),
      };
      next = sinon.spy();
    });

    it("request has a valid ISBN", async () => {
      req = {
        body: JSON.parse(
          JSON.stringify({
            isbn: validEditionInputs.isbn,
          })
        ),
      };

      for (const middleware of editionRetrievalArray) {
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
      // Reset stubs, mocks, and spies.
      sinon.restore();

      // Stubs and spies
      res = {
        status: sinon.stub().callsFake(() => {
          return res;
        }) as unknown as SinonStub,
        json: sinon.spy(),
      };
      next = sinon.spy();

      req = {
        body: JSON.parse(
          JSON.stringify({
            isbn: validEditionInputs.isbn,
          })
        ),
      };
    });

    it("isbn is undefined", async () => {
      req.body.isbn = undefined;

      for (const middleware of editionRetrievalArray) {
        await middleware(req as Request, res as Response, next);
      }

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(statusStub.calledWith(httpCodes.BAD_REQUEST), true);
      assert.strictEqual(
        jsonSpy.calledWith({
          errors: [{ message: editionFailedValidation.ISBN_REQUIRED_MESSAGE }],
        }),
        true
      );
    });

    it("isbn is invalid", async () => {
      req.body.isbn = invalidEditionInputs.INVALID_ISBN;

      for (const middleware of editionRetrievalArray) {
        await middleware(req as Request, res as Response, next);
      }

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(statusStub.calledWith(httpCodes.BAD_REQUEST), true);
      assert.strictEqual(
        jsonSpy.calledWith({
          errors: [{ message: editionFailedValidation.ISBN_INVALID_MESSAGE }],
        }),
        true
      );
    });
  });
});
