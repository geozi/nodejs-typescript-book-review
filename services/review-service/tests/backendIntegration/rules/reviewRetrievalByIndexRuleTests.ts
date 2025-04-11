import assert from "assert";
import { Request, Response } from "express";
import { reviewFailedValidation } from "messages/validation/reviewValidationMessages";
import { catchExpressValidationErrors } from "middleware/catchers/expressErrorCatcher";
import { reviewRetrievalByCompositeIndexRules } from "middleware/rules/reviewRules";
import { httpCodes } from "resources/codes/responseStatusCodes";
import sinon, { SinonSpy, SinonStub } from "sinon";
import { invalidReviewInputs, validReviewInputs } from "tests/testInputs";

describe("Review retrieval by index rules: integration tests", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: SinonSpy;
  let statusStub: SinonStub;
  let jsonSpy: SinonSpy;
  let mockSubject: string;
  let mockUsername: string;
  const reviewRetrievalArray = [
    ...reviewRetrievalByCompositeIndexRules(),
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
      mockSubject = validReviewInputs.subject;
      mockUsername = validReviewInputs.username;
    });

    it("request has valid inputs", async () => {
      req = {
        body: JSON.parse(
          JSON.stringify({ subject: mockSubject, username: mockUsername })
        ),
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
      mockSubject = validReviewInputs.subject;
      mockUsername = validReviewInputs.username;

      req = {
        body: JSON.parse(
          JSON.stringify({ subject: mockSubject, username: mockUsername })
        ),
      };
    });

    it("subject is undefined", async () => {
      req.body.subject = undefined;

      for (const middleware of reviewRetrievalArray) {
        await middleware(req as Request, res as Response, next);
      }

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(statusStub.calledWith(httpCodes.BAD_REQUEST), true);
      assert.strictEqual(
        jsonSpy.calledWith({
          errors: [
            { message: reviewFailedValidation.SUBJECT_REQUIRED_MESSAGE },
          ],
        }),
        true
      );
    });

    it("subject is too short", async () => {
      req.body.subject = invalidReviewInputs.SUBJECT_TOO_SHORT;

      for (const middleware of reviewRetrievalArray) {
        await middleware(req as Request, res as Response, next);
      }

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(statusStub.calledWith(httpCodes.BAD_REQUEST), true);
      assert.strictEqual(
        jsonSpy.calledWith({
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

      for (const middleware of reviewRetrievalArray) {
        await middleware(req as Request, res as Response, next);
      }

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(statusStub.calledWith(httpCodes.BAD_REQUEST), true);
      assert.strictEqual(
        jsonSpy.calledWith({
          errors: [
            {
              message: reviewFailedValidation.SUBJECT_ABOVE_MAX_LENGTH_MESSAGE,
            },
          ],
        }),
        true
      );
    });

    it("username is undefined", async () => {
      req.body.username = undefined;

      for (const middleware of reviewRetrievalArray) {
        await middleware(req as Request, res as Response, next);
      }

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(statusStub.calledWith(httpCodes.BAD_REQUEST), true);
      assert.strictEqual(
        jsonSpy.calledWith({
          errors: [
            {
              message: reviewFailedValidation.USERNAME_REQUIRED_MESSAGE,
            },
          ],
        }),
        true
      );
    });
  });
});
