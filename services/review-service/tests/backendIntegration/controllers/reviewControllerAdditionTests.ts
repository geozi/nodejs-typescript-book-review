import assert from "assert";
import { callReviewAddition } from "controllers/reviewController";
import { Response } from "express";
import { IReview } from "interfaces/documents/IReview";
import { IRequest } from "interfaces/secondary/IRequest";
import { IUser } from "interfaces/secondary/IUser";
import { commonResponseMessages } from "messages/response/commonResponseMessages";
import { reviewResponseMessages } from "messages/response/reviewResponseMessages";
import { Review } from "models/Review";
import { Error } from "mongoose";
import { httpCodes } from "resources/codes/responseStatusCodes";
import sinon, { SinonSpy, SinonStub } from "sinon";
import { validReviewInputs, validUserInput } from "tests/testInputs";

describe("Review addition integration tests", () => {
  let req: Partial<IRequest>;
  let res: Partial<Response>;
  let statusStub: SinonStub;
  let jsonSpy: SinonSpy;
  let setHeaderStub: SinonStub;
  let functionStub: SinonStub;
  let mockReview: IReview;
  let mockUser: IUser;

  describe("Positive scenario", () => {
    beforeEach(() => {
      // Reset stubs, spies, and mocks
      sinon.restore();

      // Stubs and spies
      functionStub = sinon.stub(Review.prototype, "save");
      res = {
        setHeader: sinon.stub().callsFake(() => res) as unknown as SinonStub,
        status: sinon.stub().callsFake(() => {
          return res;
        }) as unknown as SinonStub,
        json: sinon.spy(),
      };

      // Mocks
      mockReview = new Review({
        subject: validReviewInputs.subject,
        description: validReviewInputs.description,
        book: validReviewInputs.book,
      });
      mockUser = validUserInput;
    });

    it("created (201)", async () => {
      functionStub.resolves(mockReview);

      req = {
        body: JSON.parse(
          JSON.stringify({
            subject: validReviewInputs.subject,
            description: validReviewInputs.description,
            book: validReviewInputs.book,
          })
        ),
        user: mockUser,
      };

      await callReviewAddition(req as IRequest, res as Response);

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;
      setHeaderStub = res.setHeader as SinonStub;

      assert.strictEqual(setHeaderStub.called, true);
      assert.strictEqual(statusStub.calledWith(httpCodes.CREATED), true);
      assert.strictEqual(
        jsonSpy.calledWith({
          message: reviewResponseMessages.REVIEW_CREATED_MESSAGE,
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
      functionStub = sinon.stub(Review.prototype, "save");
      res = {
        setHeader: sinon.stub().callsFake(() => res) as unknown as SinonStub,
        status: sinon.stub().callsFake(() => {
          return res;
        }) as unknown as SinonStub,
        json: sinon.spy(),
      };

      // Mocks
      mockUser = validUserInput;

      req = {
        body: JSON.parse(
          JSON.stringify({
            subject: validReviewInputs.subject,
            description: validReviewInputs.description,
            book: validReviewInputs.book,
          })
        ),
        user: mockUser,
      };
    });

    it("server error (500)", async () => {
      functionStub.rejects();

      await callReviewAddition(req as IRequest, res as Response);

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

    it("validation error (400)", async () => {
      functionStub.rejects(new Error.ValidationError());

      await callReviewAddition(req as IRequest, res as Response);

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(statusStub.calledWith(httpCodes.BAD_REQUEST), true);
      assert.strictEqual(
        jsonSpy.calledWith({
          message: commonResponseMessages.BAD_REQUEST_MESSAGE,
          errors: "Validation failed",
        }),
        true
      );
    });
  });
});
