import assert from "assert";
import { callReviewUpdate } from "controllers/reviewController";
import { Request, Response } from "express";
import { IReview } from "interfaces/documents/IReview";
import { commonResponseMessages } from "messages/response/commonResponseMessages";
import { reviewResponseMessages } from "messages/response/reviewResponseMessages";
import { Review } from "models/Review";
import { Types } from "mongoose";
import { httpCodes } from "resources/codes/responseStatusCodes";
import sinon, { SinonSpy, SinonStub } from "sinon";
import { validReviewInputs } from "tests/testInputs";

describe("Review update integration tests", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusStub: SinonStub;
  let jsonSpy: SinonSpy;
  let setHeaderStub: SinonStub;
  let functionStub: SinonStub;
  let mockId: string;
  let mockReview: IReview;

  describe("Positive scenario", () => {
    beforeEach(() => {
      // Reset stubs, spies, and mocks
      sinon.restore();

      // Stubs and spies
      functionStub = sinon.stub(Review, "findByIdAndUpdate");
      res = {
        setHeader: sinon.stub().callsFake(() => res) as unknown as SinonStub,
        status: sinon.stub().callsFake(() => {
          return res;
        }) as unknown as SinonStub,
        json: sinon.spy(),
      };

      // Mocks
      mockId = "67fa2c37f6f701428800f127";
      mockReview = new Review({
        _id: new Types.ObjectId(mockId),
        subject: validReviewInputs.subject,
        description: validReviewInputs.description,
        book: validReviewInputs.book,
      });
    });

    it("ok (200)", async () => {
      functionStub.resolves(mockReview);

      req = {
        body: JSON.parse(
          JSON.stringify({
            id: mockId,
            subject: validReviewInputs.subject,
            description: validReviewInputs.description,
            book: validReviewInputs.book,
          })
        ),
      };

      await callReviewUpdate(req as Request, res as Response);

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;
      setHeaderStub = res.setHeader as SinonStub;

      assert.strictEqual(setHeaderStub.called, true);
      assert.strictEqual(statusStub.calledWith(httpCodes.OK), true);
      assert.strictEqual(
        jsonSpy.calledWith({
          message: reviewResponseMessages.REVIEW_UPDATE_MESSAGE,
          data: mockReview,
        }),
        true
      );
    });
  });

  describe("Negative scenarios", () => {
    beforeEach(() => {
      // Reset stubs, spies, and mocks
      sinon.restore();

      // Stubs and spies
      functionStub = sinon.stub(Review, "findByIdAndUpdate");
      res = {
        status: sinon.stub().callsFake(() => {
          return res;
        }) as unknown as SinonStub,
        json: sinon.spy(),
      };

      // Mocks
      mockId = "67fa2c37f6f701428800f127";

      req = {
        body: JSON.parse(
          JSON.stringify({
            id: mockId,
            subject: validReviewInputs.subject,
            description: validReviewInputs.description,
            book: validReviewInputs.book,
          })
        ),
      };
    });

    it("server error (500)", async () => {
      functionStub.rejects();

      await callReviewUpdate(req as Request, res as Response);

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

    it("not found (404)", async () => {
      functionStub.resolves(null);

      await callReviewUpdate(req as Request, res as Response);

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(statusStub.calledWith(httpCodes.NOT_FOUND), true);
      assert.strictEqual(
        jsonSpy.calledWith({
          message: reviewResponseMessages.REVIEW_NOT_FOUND_MESSAGE,
        }),
        true
      );
    });
  });
});
