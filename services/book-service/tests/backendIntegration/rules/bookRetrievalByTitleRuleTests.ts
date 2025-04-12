import assert from "assert";
import { Request, Response } from "express";
import { bookFailedValidation } from "messages/validation/bookValidationMessages";
import { catchExpressValidationErrors } from "middleware/catchers/expressErrorCatcher";
import { bookRetrievalByTitleRules } from "middleware/rules/bookRules";
import { httpCodes } from "resources/codes/responseStatusCodes";
import sinon, { SinonSpy, SinonStub } from "sinon";
import { invalidBookInputs, validBookInputs } from "tests/testInputs";

describe("Book retrieval by title rules: integration tests", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: SinonSpy;
  let statusStub: SinonStub;
  let jsonSpy: SinonSpy;
  const bookRetrievalByTitleArray = [
    ...bookRetrievalByTitleRules(),
    catchExpressValidationErrors,
  ];

  describe("Positive scenarios", async () => {
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
      req = {
        body: JSON.parse(JSON.stringify({ title: validBookInputs.title })),
      };
    });

    it("request has a valid title", async () => {
      for (const middleware of bookRetrievalByTitleArray) {
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
      req = {
        body: JSON.parse(JSON.stringify({ title: validBookInputs.title })),
      };
    });

    it("title is undefined", async () => {
      req.body.title = undefined;

      for (const middleware of bookRetrievalByTitleArray) {
        await middleware(req as Request, res as Response, next);
      }

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(statusStub.calledWith(httpCodes.BAD_REQUEST), true);
      assert.strictEqual(
        jsonSpy.calledWith({
          errors: [{ message: bookFailedValidation.TITLE_REQUIRED_MESSAGE }],
        }),
        true
      );
    });

    it("title is too short", async () => {
      req.body.title = invalidBookInputs.TITLE_TOO_SHORT;

      for (const middleware of bookRetrievalByTitleArray) {
        await middleware(req as Request, res as Response, next);
      }

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(statusStub.calledWith(httpCodes.BAD_REQUEST), true);
      assert.strictEqual(
        jsonSpy.calledWith({
          errors: [
            { message: bookFailedValidation.TITLE_BELOW_MIN_LENGTH_MESSAGE },
          ],
        }),
        true
      );
    });

    it("title is too long", async () => {
      req.body.title = invalidBookInputs.TITLE_TOO_LONG;

      for (const middleware of bookRetrievalByTitleArray) {
        await middleware(req as Request, res as Response, next);
      }

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(statusStub.calledWith(httpCodes.BAD_REQUEST), true);
      assert.strictEqual(
        jsonSpy.calledWith({
          errors: [
            { message: bookFailedValidation.TITLE_ABOVE_MAX_LENGTH_MESSAGE },
          ],
        }),
        true
      );
    });
  });
});
