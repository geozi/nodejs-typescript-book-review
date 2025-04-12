import assert from "assert";
import { BSONError } from "bson";
import { Request } from "express";
import { IRequest } from "interfaces/secondary/IRequest";
import { IUser } from "interfaces/secondary/IUser";
import {
  reqBodyToId,
  reqBodyToReview,
  reqBodyToReviewUpdate,
} from "mappers/reviewMapper";
import { reviewFailedValidation } from "messages/validation/reviewValidationMessages";
import { Review } from "models/Review";
import { Error, Types } from "mongoose";
import sinon, { SinonStub } from "sinon";
import {
  invalidReviewInputs,
  validReviewInputs,
  validUserInput,
} from "tests/testInputs";

describe("Review mapper unit tests", () => {
  let iReq: Partial<IRequest>;
  let nReq: Partial<Request>; //  normal, non-extended Request
  let validateSyncStub: SinonStub;
  let mockId: string;
  let mockUser: IUser;
  let validationError: Error.ValidationError;

  describe(`${reqBodyToReview.name}`, () => {
    describe("Positive scenario", () => {
      beforeEach(() => {
        // Reset stubs
        sinon.restore();

        // Stubs
        validateSyncStub = sinon.stub(Review.prototype, "validateSync");

        // Mocks
        mockUser = JSON.parse(JSON.stringify(validUserInput));

        // HTTP request
        iReq = {
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

      it("request has valid inputs", () => {
        validateSyncStub.returns(undefined);

        const newReview = reqBodyToReview(iReq as IRequest);
        const mongooseErrors = newReview.validateSync();

        assert.strictEqual(mongooseErrors, undefined);
      });
    });

    describe("Negative scenarios", () => {
      beforeEach(() => {
        // Reset stubs
        sinon.restore();

        // Stubs
        validateSyncStub = sinon.stub(Review.prototype, "validateSync");

        // Mocks
        mockUser = JSON.parse(JSON.stringify(validUserInput));

        // HTTP request
        iReq = {
          body: JSON.parse(
            JSON.stringify({
              subject: validReviewInputs.subject,
              description: validReviewInputs.description,
              book: validReviewInputs.book,
            })
          ),
          user: mockUser,
        };

        validationError = new Error.ValidationError();
      });

      it("subject is undefined", () => {
        validationError.errors = {
          subject: new Error.ValidatorError({
            message: reviewFailedValidation.SUBJECT_REQUIRED_MESSAGE,
            path: "subject",
            value: "",
          }),
        };

        validateSyncStub.returns(validationError);
        iReq.body.subject = undefined;

        const newReview = reqBodyToReview(iReq as IRequest);
        const mongooseErrors = newReview.validateSync();

        assert.strictEqual(
          mongooseErrors?.errors.subject.message,
          reviewFailedValidation.SUBJECT_REQUIRED_MESSAGE
        );
      });

      it("subject is too short", () => {
        validationError.errors = {
          subject: new Error.ValidatorError({
            message: reviewFailedValidation.SUBJECT_BELOW_MIN_LENGTH_MESSAGE,
            path: "subject",
            value: invalidReviewInputs.SUBJECT_TOO_SHORT,
          }),
        };

        validateSyncStub.returns(validationError);
        iReq.body.subject = invalidReviewInputs.SUBJECT_TOO_SHORT;

        const newReview = reqBodyToReview(iReq as IRequest);
        const mongooseErrors = newReview.validateSync();

        assert.strictEqual(
          mongooseErrors?.errors.subject.message,
          reviewFailedValidation.SUBJECT_BELOW_MIN_LENGTH_MESSAGE
        );
      });

      it("subject is too long", () => {
        validationError.errors = {
          subject: new Error.ValidatorError({
            message: reviewFailedValidation.SUBJECT_ABOVE_MAX_LENGTH_MESSAGE,
            path: "subject",
            value: invalidReviewInputs.SUBJECT_TOO_LONG,
          }),
        };

        validateSyncStub.returns(validationError);
        iReq.body.subject = invalidReviewInputs.SUBJECT_TOO_LONG;

        const newReview = reqBodyToReview(iReq as IRequest);
        const mongooseErrors = newReview.validateSync();

        assert.strictEqual(
          mongooseErrors?.errors.subject.message,
          reviewFailedValidation.SUBJECT_ABOVE_MAX_LENGTH_MESSAGE
        );
      });

      it("description is undefined", () => {
        validationError.errors = {
          description: new Error.ValidatorError({
            message: reviewFailedValidation.DESCRIPTION_REQUIRED_MESSAGE,
            path: "description",
            value: "",
          }),
        };

        validateSyncStub.returns(validationError);
        iReq.body.description = undefined;

        const newReview = reqBodyToReview(iReq as IRequest);
        const mongooseErrors = newReview.validateSync();

        assert.strictEqual(
          mongooseErrors?.errors.description.message,
          reviewFailedValidation.DESCRIPTION_REQUIRED_MESSAGE
        );
      });

      it("description is too short", () => {
        validationError.errors = {
          description: new Error.ValidatorError({
            message:
              reviewFailedValidation.DESCRIPTION_BELOW_MIN_LENGTH_MESSAGE,
            path: "description",
            value: invalidReviewInputs.DESCRIPTION_TOO_SHORT,
          }),
        };

        validateSyncStub.returns(validationError);
        iReq.body.description = invalidReviewInputs.DESCRIPTION_TOO_SHORT;

        const newReview = reqBodyToReview(iReq as IRequest);
        const mongooseErrors = newReview.validateSync();

        assert.strictEqual(
          mongooseErrors?.errors.description.message,
          reviewFailedValidation.DESCRIPTION_BELOW_MIN_LENGTH_MESSAGE
        );
      });

      it("description is too long", () => {
        validationError.errors = {
          description: new Error.ValidatorError({
            message:
              reviewFailedValidation.DESCRIPTION_ABOVE_MAX_LENGTH_MESSAGE,
            path: "description",
            value: invalidReviewInputs.DESCRIPTION_TOO_LONG,
          }),
        };

        validateSyncStub.returns(validationError);
        iReq.body.description = invalidReviewInputs.DESCRIPTION_TOO_LONG;

        const newReview = reqBodyToReview(iReq as IRequest);
        const mongooseErrors = newReview.validateSync();

        assert.strictEqual(
          mongooseErrors?.errors.description.message,
          reviewFailedValidation.DESCRIPTION_ABOVE_MAX_LENGTH_MESSAGE
        );
      });

      it("book.id is undefined", () => {
        validationError.errors = {
          "book.id": new Error.ValidatorError({
            message: reviewFailedValidation.BOOK_ID_REQUIRED_MESSAGE,
            path: "book.id",
            value: "",
          }),
        };

        validateSyncStub.returns(validationError);
        iReq.body.book.id = undefined;

        const newReview = reqBodyToReview(iReq as IRequest);
        const mongooseErrors = newReview.validateSync();

        assert.strictEqual(
          mongooseErrors?.errors["book.id"].message,
          reviewFailedValidation.BOOK_ID_REQUIRED_MESSAGE
        );
      });

      it("book.id is negative", () => {
        validationError.errors = {
          "book.id": new Error.ValidatorError({
            message: reviewFailedValidation.BOOK_ID_NEGATIVE_MESSAGE,
            path: "book.id",
            value: invalidReviewInputs.NEGATIVE_BOOK_ID,
          }),
        };

        validateSyncStub.returns(validationError);
        iReq.body.book.id = invalidReviewInputs.NEGATIVE_BOOK_ID;

        const newReview = reqBodyToReview(iReq as IRequest);
        const mongooseErrors = newReview.validateSync();

        assert.strictEqual(
          mongooseErrors?.errors["book.id"].message,
          reviewFailedValidation.BOOK_ID_NEGATIVE_MESSAGE
        );
      });
    });
  });

  describe(`${reqBodyToReviewUpdate.name}`, () => {
    describe("Positive scenario", () => {
      beforeEach(() => {
        // Mocks
        mockId = "67f6813b01931bccda945c30";

        // HTTP request
        nReq = {
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

      it("request has valid inputs", () => {
        const reviewToUpdate = reqBodyToReviewUpdate(nReq as Request);

        assert.strictEqual(reviewToUpdate.id.toString(), mockId);
      });
    });

    describe("Negative scenarios", () => {
      beforeEach(() => {
        // Mocks
        mockId = "67f6813b01931bccda945c30";

        // HTTP request
        nReq = {
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

      it("review ID is undefined -> TypeError", () => {
        nReq.body.id = undefined;

        try {
          reqBodyToReviewUpdate(nReq as Request);
        } catch (error) {
          assert(error instanceof TypeError);
        }
      });

      it("review ID is an integer -> TypeError", () => {
        nReq.body.id = invalidReviewInputs.INVALID_REVIEW_ID_INTEGER;

        try {
          reqBodyToReviewUpdate(nReq as Request);
        } catch (error) {
          assert(error instanceof TypeError);
        }
      });

      it("review ID is an invalid string -> BSONError", () => {
        nReq.body.id = invalidReviewInputs.INVALID_REVIEW_ID_STRING;

        try {
          reqBodyToReviewUpdate(nReq as Request);
        } catch (error) {
          assert.strictEqual(BSONError.isBSONError(error), true);
        }
      });
    });
  });

  describe(`${reqBodyToId.name}`, () => {
    describe("Positive scenario", () => {
      beforeEach(() => {
        // Mocks
        mockId = "67f6813b01931bccda945c30";

        // HTTP request
        nReq = {
          body: JSON.parse(JSON.stringify({ id: mockId })),
        };
      });

      it("request has a valid review ID", () => {
        const id = reqBodyToId(nReq as Request);

        assert(id instanceof Types.ObjectId);
        assert.strictEqual(id.toString(), mockId);
      });
    });

    describe("Negative scenarios", () => {
      beforeEach(() => {
        // Mocks
        mockId = "67f6813b01931bccda945c30";

        // HTTP request
        nReq = {
          body: JSON.parse(JSON.stringify({ id: mockId })),
        };
      });

      it("review ID is undefined -> TypeError", () => {
        nReq.body.id = undefined;

        try {
          reqBodyToId(nReq as Request);
        } catch (error) {
          assert(error instanceof TypeError);
        }
      });

      it("review ID is an integer -> TypeError", () => {
        nReq.body.id = invalidReviewInputs.INVALID_REVIEW_ID_INTEGER;

        try {
          reqBodyToId(nReq as Request);
        } catch (error) {
          assert(error instanceof TypeError);
        }
      });

      it("review ID is an invalid string -> BSONError", () => {
        nReq.body.id = invalidReviewInputs.INVALID_REVIEW_ID_STRING;

        try {
          reqBodyToId(nReq as Request);
        } catch (error) {
          assert.strictEqual(BSONError.isBSONError(error), true);
        }
      });
    });
  });
});
