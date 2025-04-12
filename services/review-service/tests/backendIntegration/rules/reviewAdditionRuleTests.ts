import assert from "assert";
import { Request, Response } from "express";
import { commonResponseMessages } from "messages/response/commonResponseMessages";
import { reviewFailedValidation } from "messages/validation/reviewValidationMessages";
import { catchExpressValidationErrors } from "middleware/catchers/expressErrorCatcher";
import { reviewAdditionRules } from "middleware/rules/reviewRules";
import { httpCodes } from "resources/codes/responseStatusCodes";
import sinon, { SinonSpy, SinonStub } from "sinon";
import { invalidReviewInputs, validReviewInputs } from "tests/testInputs";

describe("Review addition rules: integration tests", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: SinonSpy;
  let statusStub: SinonStub;
  let jsonSpy: SinonSpy;
  const reviewAdditionArray = [
    ...reviewAdditionRules(),
    catchExpressValidationErrors,
  ];

  describe("Positive scenario", () => {
    beforeEach(() => {
      // Reset stubs and spies.
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
        body: JSON.parse(
          JSON.stringify({
            subject: validReviewInputs.subject,
            description: validReviewInputs.description,
            book: validReviewInputs.book,
          })
        ),
      };
    });

    it("request has valid inputs", async () => {
      for (const middleware of reviewAdditionArray) {
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
      // Reset stubs and spies.
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
        body: JSON.parse(
          JSON.stringify({
            subject: validReviewInputs.subject,
            description: validReviewInputs.description,
            book: validReviewInputs.book,
          })
        ),
      };
    });

    it("subject is undefined", async () => {
      req.body.subject = undefined;

      for (const middleware of reviewAdditionArray) {
        await middleware(req as Request, res as Response, next);
      }

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(statusStub.calledWith(httpCodes.BAD_REQUEST), true);
      assert.strictEqual(
        jsonSpy.calledWith({
          message: commonResponseMessages.BAD_REQUEST_MESSAGE,
          errors: [
            { message: reviewFailedValidation.SUBJECT_REQUIRED_MESSAGE },
          ],
        }),
        true
      );
    });

    it("subject is too short", async () => {
      req.body.subject = invalidReviewInputs.SUBJECT_TOO_SHORT;

      for (const middleware of reviewAdditionArray) {
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
              message: reviewFailedValidation.SUBJECT_BELOW_MIN_LENGTH_MESSAGE,
            },
          ],
        }),
        true
      );
    });

    it("subject is too long", async () => {
      req.body.subject = invalidReviewInputs.SUBJECT_TOO_LONG;

      for (const middleware of reviewAdditionArray) {
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
              message: reviewFailedValidation.SUBJECT_ABOVE_MAX_LENGTH_MESSAGE,
            },
          ],
        }),
        true
      );
    });

    it("description is undefined", async () => {
      req.body.description = undefined;

      for (const middleware of reviewAdditionArray) {
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
              message: reviewFailedValidation.DESCRIPTION_REQUIRED_MESSAGE,
            },
          ],
        }),
        true
      );
    });

    it("description is too short", async () => {
      req.body.description = invalidReviewInputs.DESCRIPTION_TOO_SHORT;

      for (const middleware of reviewAdditionArray) {
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
              message:
                reviewFailedValidation.DESCRIPTION_BELOW_MIN_LENGTH_MESSAGE,
            },
          ],
        }),
        true
      );
    });

    it("description is too long", async () => {
      req.body.description = invalidReviewInputs.DESCRIPTION_TOO_LONG;

      for (const middleware of reviewAdditionArray) {
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
              message:
                reviewFailedValidation.DESCRIPTION_ABOVE_MAX_LENGTH_MESSAGE,
            },
          ],
        }),
        true
      );
    });

    it("book is undefined", async () => {
      req.body.book = undefined;

      for (const middleware of reviewAdditionArray) {
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

      for (const middleware of reviewAdditionArray) {
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

      for (const middleware of reviewAdditionArray) {
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

      for (const middleware of reviewAdditionArray) {
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
