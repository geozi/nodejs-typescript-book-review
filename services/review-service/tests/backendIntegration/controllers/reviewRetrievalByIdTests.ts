import assert from "assert";
import { callReviewRetrievalById } from "controllers/reviewController";
import { Request, Response } from "express";
import { IReview } from "interfaces/documents/IReview";
import { commonResponseMessages } from "messages/response/commonResponseMessages";
import { reviewResponseMessages } from "messages/response/reviewResponseMessages";
import { Review } from "models/Review";
import { httpCodes } from "resources/codes/responseStatusCodes";
import sinon, { SinonSpy, SinonStub } from "sinon";
import { validReviewInputs } from "tests/testInputs";

describe("Review retrieval by ID: integration tests", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusStub: SinonStub;
  let jsonSpy: SinonSpy;
  let setHeaderStub: SinonStub;
  let findByIdStub: SinonStub;
  let mockReview: IReview;
  let mockId: string;

  describe("Positive scenario", () => {
    beforeEach(() => {
      // Reset stubs and spies
      sinon.restore();

      // Stubs and spies
      findByIdStub = sinon.stub(Review, "findById");
      res = {
        setHeader: sinon.stub().callsFake(() => res) as unknown as SinonStub,
        status: sinon.stub().callsFake(() => {
          return res;
        }) as unknown as SinonStub,
        json: sinon.spy(),
      };

      // Mocks
      mockId = "67fa34c8210ab6991b940f72";
      mockReview = new Review(validReviewInputs);

      // HTTP request
      req = {
        body: JSON.parse(
          JSON.stringify({
            id: mockId,
          })
        ),
      };
    });

    it("response code 200", async () => {
      findByIdStub.resolves(mockReview);

      await callReviewRetrievalById(req as Request, res as Response);

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;
      setHeaderStub = res.setHeader as SinonStub;

      assert.strictEqual(setHeaderStub.called, true);
      assert.strictEqual(statusStub.calledWith(httpCodes.OK), true);
      assert.strictEqual(
        jsonSpy.calledWith({
          message: reviewResponseMessages.REVIEW_RETRIEVED_MESSAGE,
          data: mockReview,
        }),
        true
      );
    });
  });

  describe("Negative scenarios", () => {
    beforeEach(() => {
      // Reset stubs and spies
      sinon.restore();

      // Stubs and spies
      findByIdStub = sinon.stub(Review, "findById");
      res = {
        status: sinon.stub().callsFake(() => {
          return res;
        }) as unknown as SinonStub,
        json: sinon.spy(),
      };

      // Mocks
      mockId = "67fa34c8210ab6991b940f72";
      mockReview = new Review(validReviewInputs);

      // HTTP request
      req = {
        body: JSON.parse(
          JSON.stringify({
            id: mockId,
          })
        ),
      };
    });

    it("response code 500", async () => {
      findByIdStub.rejects();

      await callReviewRetrievalById(req as Request, res as Response);

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

    it("response code 404", async () => {
      findByIdStub.resolves(null);

      await callReviewRetrievalById(req as Request, res as Response);

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
