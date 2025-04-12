import assert from "assert";
import { callReviewRetrievalByBook } from "controllers/reviewController";
import { Request, Response } from "express";
import { IReview } from "interfaces/documents/IReview";
import { IBook } from "interfaces/secondary/IBook";
import { commonResponseMessages } from "messages/response/commonResponseMessages";
import { reviewResponseMessages } from "messages/response/reviewResponseMessages";
import { Review } from "models/Review";
import { httpCodes } from "resources/codes/responseStatusCodes";
import sinon, { SinonSpy, SinonStub } from "sinon";

describe("Review retrieval by book integration tests", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusStub: SinonStub;
  let jsonSpy: SinonSpy;
  let setHeaderStub: SinonStub;
  let findStub: SinonStub;
  let mockReviews: IReview[];
  let mockReview1: IReview;
  let mockReview2: IReview;
  let mockBook: IBook;
  let mockId: number;

  describe("Positive scenario", () => {
    beforeEach(() => {
      // Reset stubs and spies
      sinon.restore();

      // Stubs and spies
      findStub = sinon.stub(Review, "find");
      res = {
        setHeader: sinon.stub().callsFake(() => res) as unknown as SinonStub,
        status: sinon.stub().callsFake(() => {
          return res;
        }) as unknown as SinonStub,
        json: sinon.spy(),
      };

      // Mocks
      mockId = 1;
      mockBook = {
        id: mockId,
      };
      mockReview1 = new Review({ book: mockBook });
      mockReview2 = new Review({ book: mockBook });
      mockReviews = [mockReview1, mockReview2];

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

    it("response code 200", async () => {
      findStub.resolves(mockReviews);

      await callReviewRetrievalByBook(req as Request, res as Response);

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;
      setHeaderStub = res.setHeader as SinonStub;

      assert.strictEqual(setHeaderStub.called, true);
      assert.strictEqual(statusStub.calledWith(httpCodes.OK), true);
      assert.strictEqual(
        jsonSpy.calledWith({
          message: reviewResponseMessages.REVIEW_S_RETRIEVED_MESSAGE,
          data: mockReviews,
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
      findStub = sinon.stub(Review, "find");
      res = {
        status: sinon.stub().callsFake(() => {
          return res;
        }) as unknown as SinonStub,
        json: sinon.spy(),
      };

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

    it("response code 500", async () => {
      findStub.rejects();

      await callReviewRetrievalByBook(req as Request, res as Response);

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
      findStub.resolves([]);

      await callReviewRetrievalByBook(req as Request, res as Response);

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(statusStub.calledWith(httpCodes.NOT_FOUND), true);
      assert.strictEqual(
        jsonSpy.calledWith({
          message: reviewResponseMessages.REVIEW_S_NOT_FOUND_MESSAGE,
        }),
        true
      );
    });
  });
});
