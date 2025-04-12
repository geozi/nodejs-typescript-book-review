import assert from "assert";
import { Request, Response } from "express";
import { editionFailedValidation } from "messages/validation/editionValidationMessages";
import { catchExpressValidationErrors } from "middleware/catchers/expressErrorCatcher";
import { editionRetrievalByBookRules } from "middleware/rules/editionRules";
import { httpCodes } from "resources/codes/responseStatusCodes";
import sinon, { SinonSpy, SinonStub } from "sinon";
import { invalidEditionInputs } from "tests/testInputs";

describe("Edition retrieval by book rules: integration tests", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: SinonSpy;
  let statusStub: SinonStub;
  let jsonSpy: SinonSpy;
  let mockId: number;
  const editionRetrievalArray = [
    ...editionRetrievalByBookRules(),
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

      // Mocks
      mockId = 1;

      // HTTP requests
      req = {
        body: JSON.parse(
          JSON.stringify({
            book: {
              id: mockId,
            },
          })
        ),
      };
    });

    it("edition has a valid bookId", async () => {
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

      // Mocks
      mockId = 1;

      // HTTP request
      req = {
        body: JSON.parse(
          JSON.stringify({
            book: {
              id: mockId,
            },
          })
        ),
      };
    });

    it("book is undefined", async () => {
      req.body = {};

      for (const middleware of editionRetrievalArray) {
        await middleware(req as Request, res as Response, next);
      }

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(statusStub.calledWith(httpCodes.BAD_REQUEST), true);
      assert.strictEqual(
        jsonSpy.calledWith({
          errors: [{ message: editionFailedValidation.BOOK_REQUIRED_MESSAGE }],
        }),
        true
      );
    });

    it("book.id is undefined", async () => {
      req.body.book = {};

      for (const middleware of editionRetrievalArray) {
        await middleware(req as Request, res as Response, next);
      }

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(statusStub.calledWith(httpCodes.BAD_REQUEST), true);
      assert.strictEqual(
        jsonSpy.calledWith({
          errors: [
            { message: editionFailedValidation.BOOK_ID_REQUIRED_MESSAGE },
          ],
        }),
        true
      );
    });

    it("book.id is invalid", async () => {
      req.body.book.id = invalidEditionInputs.INVALID_BOOK_ID;

      for (const middleware of editionRetrievalArray) {
        await middleware(req as Request, res as Response, next);
      }

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(statusStub.calledWith(httpCodes.BAD_REQUEST), true);
      assert.strictEqual(
        jsonSpy.calledWith({
          errors: [
            { message: editionFailedValidation.BOOK_ID_INVALID_MESSAGE },
          ],
        }),
        true
      );
    });
  });
});
