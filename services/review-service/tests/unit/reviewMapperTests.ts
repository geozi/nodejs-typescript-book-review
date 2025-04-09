import assert from "assert";
import { BSONError } from "bson";
import { Request } from "express";
import {
  reqBodyToId,
  reqBodyToReview,
  reqBodyToReviewUpdate,
} from "mappers/reviewMapper";
import { reviewFailedValidation } from "messages/validation/reviewValidationMessages";
import { Types } from "mongoose";
import { invalidReviewInputs, validReviewInputs } from "tests/testInputs";

describe("Review mapper unit tests", () => {
  let req: Partial<Request>;
  let mockId: string;

  describe(`${reqBodyToReview.name}`, () => {
    describe("Positive scenario", () => {
      beforeEach(() => {
        req = {
          body: JSON.parse(JSON.stringify(validReviewInputs)),
        };
      });

      it("request has valid inputs", () => {
        const newReview = reqBodyToReview(req as Request);
        const mongooseErrors = newReview.validateSync();

        assert.strictEqual(mongooseErrors, undefined);
      });
    });

    describe("Negative scenarios", () => {
      beforeEach(() => {
        req = {
          body: JSON.parse(JSON.stringify(validReviewInputs)),
        };
      });

      it("subject is undefined", () => {
        req.body.subject = undefined;

        const newReview = reqBodyToReview(req as Request);
        const mongooseErrors = newReview.validateSync();

        assert.strictEqual(
          mongooseErrors?.errors.subject.message,
          reviewFailedValidation.SUBJECT_REQUIRED_MESSAGE
        );
      });

      it("subject is too short", () => {
        req.body.subject = invalidReviewInputs.SUBJECT_TOO_SHORT;

        const newReview = reqBodyToReview(req as Request);
        const mongooseErrors = newReview.validateSync();

        assert.strictEqual(
          mongooseErrors?.errors.subject.message,
          reviewFailedValidation.SUBJECT_BELOW_MIN_LENGTH_MESSAGE
        );
      });

      it("subject is too long", () => {
        req.body.subject = invalidReviewInputs.SUBJECT_TOO_LONG;

        const newReview = reqBodyToReview(req as Request);
        const mongooseErrors = newReview.validateSync();

        assert.strictEqual(
          mongooseErrors?.errors.subject.message,
          reviewFailedValidation.SUBJECT_ABOVE_MAX_LENGTH_MESSAGE
        );
      });

      it("description is undefined", () => {
        req.body.description = undefined;

        const newReview = reqBodyToReview(req as Request);
        const mongooseErrors = newReview.validateSync();

        assert.strictEqual(
          mongooseErrors?.errors.description.message,
          reviewFailedValidation.DESCRIPTION_REQUIRED_MESSAGE
        );
      });

      it("description is too short", () => {
        req.body.description = invalidReviewInputs.DESCRIPTION_TOO_SHORT;

        const newReview = reqBodyToReview(req as Request);
        const mongooseErrors = newReview.validateSync();

        assert.strictEqual(
          mongooseErrors?.errors.description.message,
          reviewFailedValidation.DESCRIPTION_BELOW_MIN_LENGTH_MESSAGE
        );
      });

      it("description is too long", () => {
        req.body.description = invalidReviewInputs.DESCRIPTION_TOO_LONG;

        const newReview = reqBodyToReview(req as Request);
        const mongooseErrors = newReview.validateSync();

        assert.strictEqual(
          mongooseErrors?.errors.description.message,
          reviewFailedValidation.DESCRIPTION_ABOVE_MAX_LENGTH_MESSAGE
        );
      });

      it("book.id is undefined", () => {
        req.body.book.id = undefined;

        const newReview = reqBodyToReview(req as Request);
        const mongooseErrors = newReview.validateSync();

        assert.strictEqual(
          mongooseErrors?.errors["book.id"].message,
          reviewFailedValidation.BOOK_ID_REQUIRED_MESSAGE
        );
      });

      it("book.id is negative", () => {
        req.body.book.id = invalidReviewInputs.NEGATIVE_BOOK_ID;

        const newReview = reqBodyToReview(req as Request);
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

        req = {
          body: JSON.parse(
            JSON.stringify({ id: mockId, ...validReviewInputs })
          ),
        };
      });

      it("request has valid inputs", () => {
        const reviewToUpdate = reqBodyToReviewUpdate(req as Request);

        assert.strictEqual(reviewToUpdate.id.toString(), mockId);
      });
    });

    describe("Negative scenarios", () => {
      beforeEach(() => {
        // Mocks
        mockId = "67f6813b01931bccda945c30";

        req = {
          body: JSON.parse(
            JSON.stringify({ id: mockId, ...validReviewInputs })
          ),
        };
      });

      it("review ID is undefined -> TypeError", () => {
        req.body.id = undefined;

        try {
          reqBodyToReviewUpdate(req as Request);
        } catch (error) {
          assert(error instanceof TypeError);
        }
      });

      it("review ID is an integer -> TypeError", () => {
        req.body.id = invalidReviewInputs.INVALID_REVIEW_ID_INTEGER;

        try {
          reqBodyToReviewUpdate(req as Request);
        } catch (error) {
          assert(error instanceof TypeError);
        }
      });

      it("review ID is an invalid string -> BSONError", () => {
        req.body.id = invalidReviewInputs.INVALID_REVIEW_ID_STRING;

        try {
          reqBodyToReviewUpdate(req as Request);
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

        req = {
          body: JSON.parse(JSON.stringify({ id: mockId })),
        };
      });

      it("request has a valid review ID", () => {
        const id = reqBodyToId(req as Request);

        assert(id instanceof Types.ObjectId);
        assert.strictEqual(id.toString(), mockId);
      });
    });

    describe("Negative scenarios", () => {
      beforeEach(() => {
        // Mocks
        mockId = "67f6813b01931bccda945c30";

        req = {
          body: JSON.parse(JSON.stringify({ id: mockId })),
        };
      });

      it("review ID is undefined -> TypeError", () => {
        req.body.id = undefined;

        try {
          reqBodyToId(req as Request);
        } catch (error) {
          assert(error instanceof TypeError);
        }
      });

      it("review ID is an integer -> TypeError", () => {
        req.body.id = invalidReviewInputs.INVALID_REVIEW_ID_INTEGER;

        try {
          reqBodyToId(req as Request);
        } catch (error) {
          assert(error instanceof TypeError);
        }
      });

      it("review ID is an invalid string -> BSONError", () => {
        req.body.id = invalidReviewInputs.INVALID_REVIEW_ID_STRING;

        try {
          reqBodyToId(req as Request);
        } catch (error) {
          assert.strictEqual(BSONError.isBSONError(error), true);
        }
      });
    });
  });
});
