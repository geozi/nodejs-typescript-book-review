import assert from "assert";
import { Request, Response } from "express";
import { reviewFailedValidation } from "messages/validation/reviewValidationMessages";
import { catchExpressValidationErrors } from "middleware/catchers/expressErrorCatcher";
import { reviewRetrievalByIdRules } from "middleware/rules/reviewRules";
import { httpCodes } from "resources/codes/responseStatusCodes";
import sinon, { SinonSpy, SinonStub } from "sinon";
import { invalidReviewInputs } from "tests/testInputs";

describe("Review retrieval by ID rules: integration tests", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: SinonSpy;
  let statusStub: SinonStub;
  let jsonSpy: SinonSpy;
  let mockId: string;
  const reviewRetrievalArray = [
    ...reviewRetrievalByIdRules(),
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
      mockId = "67f7e82aee79cbf984fdb26a";
    });

    it("request has valid inputs", async () => {
      req = {
        body: JSON.parse(JSON.stringify({ id: mockId })),
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
      mockId = "67f7e82aee79cbf984fdb26a";

      req = {
        body: JSON.parse(JSON.stringify({ id: mockId })),
      };
    });

    it("review ID is undefined", async () => {
      req.body.id = undefined;

      for (const middleware of reviewRetrievalArray) {
        await middleware(req as Request, res as Response, next);
      }

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(statusStub.calledWith(httpCodes.BAD_REQUEST), true);
      assert.strictEqual(
        jsonSpy.calledWith({
          errors: [
            { message: reviewFailedValidation.REVIEW_ID_REQUIRED_MESSAGE },
          ],
        }),
        true
      );
    });

    it("review ID as string is invalid", async () => {
      req.body.id = invalidReviewInputs.INVALID_REVIEW_ID_STRING;

      for (const middleware of reviewRetrievalArray) {
        await middleware(req as Request, res as Response, next);
      }

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(statusStub.calledWith(httpCodes.BAD_REQUEST), true);
      assert.strictEqual(
        jsonSpy.calledWith({
          errors: [
            { message: reviewFailedValidation.REVIEW_ID_INVALID_MESSAGE },
          ],
        }),
        true
      );
    });

    it("review ID as integer is invalid", async () => {
      req.body.id = invalidReviewInputs.INVALID_REVIEW_ID_INTEGER;

      for (const middleware of reviewRetrievalArray) {
        await middleware(req as Request, res as Response, next);
      }

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(statusStub.calledWith(httpCodes.BAD_REQUEST), true);
      assert.strictEqual(
        jsonSpy.calledWith({
          errors: [
            { message: reviewFailedValidation.REVIEW_ID_INVALID_MESSAGE },
          ],
        }),
        true
      );
    });
  });
});
