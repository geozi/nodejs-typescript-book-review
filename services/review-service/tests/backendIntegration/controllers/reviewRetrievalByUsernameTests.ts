import assert from "assert";
import { callReviewRetrievalByUsername } from "controllers/reviewController";
import { Request, Response } from "express";
import { IReview } from "interfaces/documents/IReview";
import { IUser } from "interfaces/secondary/IUser";
import { commonResponseMessages } from "messages/response/commonResponseMessages";
import { reviewResponseMessages } from "messages/response/reviewResponseMessages";
import { Review } from "models/Review";
import { httpCodes } from "resources/codes/responseStatusCodes";
import sinon, { SinonSpy, SinonStub } from "sinon";
import { validUserInput } from "tests/testInputs";

describe("Review retrieval by username integration tests", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusStub: SinonStub;
  let jsonSpy: SinonSpy;
  let setHeaderStub: SinonStub;
  let findStub: SinonStub;
  let mockReviews: IReview[];
  let mockReview1: IReview;
  let mockReview2: IReview;
  let mockUser: IUser;

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
      mockUser = validUserInput;
      mockReview1 = new Review({ username: validUserInput.username });
      mockReview2 = new Review({ username: validUserInput.username });
      mockReviews = [mockReview1, mockReview2];

      // HTTP request
      req = {
        body: JSON.parse(
          JSON.stringify({
            username: mockUser.username,
          })
        ),
      };
    });

    it("response code 200", async () => {
      findStub.resolves(mockReviews);

      await callReviewRetrievalByUsername(req as Request, res as Response);

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
      mockReview1 = new Review({ username: validUserInput.username });
      mockReview2 = new Review({ username: validUserInput.username });
      mockReviews = [mockReview1, mockReview2];

      // HTTP request
      req = {
        body: JSON.parse(
          JSON.stringify({
            username: mockUser.username,
          })
        ),
      };
    });

    it("response code 500", async () => {
      findStub.rejects();

      await callReviewRetrievalByUsername(req as Request, res as Response);

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

      await callReviewRetrievalByUsername(req as Request, res as Response);

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
