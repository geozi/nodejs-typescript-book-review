import assert from "assert";
import { Request, Response } from "express";
import { IBook } from "interfaces/secondary/IBook";
import { commonResponseMessages } from "messages/response/commonResponseMessages";
import { reviewFailedValidation } from "messages/validation/reviewValidationMessages";
import { catchExpressValidationErrors } from "middleware/catchers/expressErrorCatcher";
import { reviewRetrievalByBookRules } from "middleware/rules/reviewRules";
import { httpCodes } from "resources/codes/responseStatusCodes";
import sinon, { SinonSpy, SinonStub } from "sinon";
import { invalidReviewInputs } from "tests/testInputs";

describe("Review retrieval by book rules: integration tests", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: SinonSpy;
  let statusStub: SinonStub;
  let jsonSpy: SinonSpy;
  let mockId: number;
  let mockBook: IBook;
  const reviewRetrievalArray = [
    ...reviewRetrievalByBookRules(),
    catchExpressValidationErrors,
  ];

  describe("Positive scenario", () => {
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

      // Mocks
      mockId = 1;
      mockBook = {
        id: mockId,
      };
    });

    it("request has valid inputs", async () => {
      req = {
        body: JSON.parse(JSON.stringify({ book: mockBook })),
      };

      for (const middleware of reviewRetrievalArray) {
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

      // Mocks
      mockId = 1;
      mockBook = {
        id: mockId,
      };

      req = {
        body: JSON.parse(JSON.stringify({ book: mockBook })),
      };
    });

    it("book is undefined", async () => {
      req.body.book = undefined;

      for (const middleware of reviewRetrievalArray) {
        await middleware(req as Request, res as Response, next);
      }

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(statusStub.calledWith(httpCodes.BAD_REQUEST), true);
      assert.strictEqual(
        jsonSpy.calledWith({
          message: commonResponseMessages.BAD_REQUEST_MESSAGE,
          errors: [
            {
              message: reviewFailedValidation.BOOK_REQUIRED_MESSAGE,
            },
          ],
        }),
        true
      );
    });

    it("book.id is undefined", async () => {
      req.body.book.id = undefined;

      for (const middleware of reviewRetrievalArray) {
        await middleware(req as Request, res as Response, next);
      }

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(statusStub.calledWith(httpCodes.BAD_REQUEST), true);
      assert.strictEqual(
        jsonSpy.calledWith({
          message: commonResponseMessages.BAD_REQUEST_MESSAGE,
          errors: [
            {
              message: reviewFailedValidation.BOOK_ID_REQUIRED_MESSAGE,
            },
          ],
        }),
        true
      );
    });

    it("book.id is negative", async () => {
      req.body.book.id = invalidReviewInputs.NEGATIVE_BOOK_ID;

      for (const middleware of reviewRetrievalArray) {
        await middleware(req as Request, res as Response, next);
      }

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(statusStub.calledWith(httpCodes.BAD_REQUEST), true);
      assert.strictEqual(
        jsonSpy.calledWith({
          message: commonResponseMessages.BAD_REQUEST_MESSAGE,
          errors: [
            {
              message: reviewFailedValidation.BOOK_ID_NEGATIVE_MESSAGE,
            },
          ],
        }),
        true
      );
    });

    it("book.id is invalid", async () => {
      req.body.book.id = invalidReviewInputs.INVALID_BOOK_ID;

      for (const middleware of reviewRetrievalArray) {
        await middleware(req as Request, res as Response, next);
      }

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(statusStub.calledWith(httpCodes.BAD_REQUEST), true);
      assert.strictEqual(
        jsonSpy.calledWith({
          message: commonResponseMessages.BAD_REQUEST_MESSAGE,
          errors: [
            {
              message: reviewFailedValidation.BOOK_ID_INVALID_MESSAGE,
            },
          ],
        }),
        true
      );
    });
  });
});
