import assert from "assert";
import { Request } from "express";
import { reqBodyToReview } from "mappers/reviewMapper";
import { reviewFailedValidation } from "messages/validation/reviewValidationMessages";
import { invalidReviewInputs, validReviewInputs } from "tests/testInputs";

describe.only("Review mapper unit tests", () => {
  let req: Partial<Request>;

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
    });
  });
});
