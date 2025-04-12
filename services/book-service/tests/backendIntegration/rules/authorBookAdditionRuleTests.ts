import assert from "assert";
import { Request, Response } from "express";
import { authorFailedValidation } from "messages/validation/authorValidationMessages";
import { bookFailedValidation } from "messages/validation/bookValidationMessages";
import { catchExpressValidationErrors } from "middleware/catchers/expressErrorCatcher";
import { authorBookAdditionRules } from "middleware/rules/authorBookRules";
import { httpCodes } from "resources/codes/responseStatusCodes";
import sinon, { SinonSpy, SinonStub } from "sinon";
import { invalidAuthorInputs, invalidBookInputs } from "tests/testInputs";

describe("AuthorBook addition rules: integration tests", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: SinonSpy;
  let statusStub: SinonStub;
  let jsonSpy: SinonSpy;
  let mockBookId: number;
  let mockAuthorId: number;
  const authorBookAdditionArray = [
    ...authorBookAdditionRules(),
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
      mockBookId = 1;
      mockAuthorId = 1;

      // HTTP request
      req = {
        body: JSON.parse(
          JSON.stringify({
            bookId: mockBookId,
            authorId: mockAuthorId,
          })
        ),
      };
    });

    it("request has valid inputs", async () => {
      for (const middleware of authorBookAdditionArray) {
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
      mockBookId = 1;
      mockAuthorId = 1;

      // HTTP request
      req = {
        body: JSON.parse(
          JSON.stringify({
            bookId: mockBookId,
            authorId: mockAuthorId,
          })
        ),
      };
    });

    it("bookId is undefined", async () => {
      req.body.bookId = undefined;

      for (const middleware of authorBookAdditionArray) {
        await middleware(req as Request, res as Response, next);
      }

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(statusStub.calledWith(httpCodes.BAD_REQUEST), true);
      assert.strictEqual(
        jsonSpy.calledWith({
          errors: [{ message: bookFailedValidation.BOOK_ID_REQUIRED_MESSAGE }],
        }),
        true
      );
    });

    it("bookId is invalid", async () => {
      req.body.bookId = invalidBookInputs.INVALID_BOOK_ID;

      for (const middleware of authorBookAdditionArray) {
        await middleware(req as Request, res as Response, next);
      }

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(statusStub.calledWith(httpCodes.BAD_REQUEST), true);
      assert.strictEqual(
        jsonSpy.calledWith({
          errors: [{ message: bookFailedValidation.BOOK_ID_INVALID_MESSAGE }],
        }),
        true
      );
    });

    it("authorId is undefined", async () => {
      req.body.authorId = undefined;

      for (const middleware of authorBookAdditionArray) {
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

    it("authorId is invalid", async () => {
      req.body.authorId = invalidAuthorInputs.INVALID_AUTHOR_ID;

      for (const middleware of authorBookAdditionArray) {
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
  });
});
