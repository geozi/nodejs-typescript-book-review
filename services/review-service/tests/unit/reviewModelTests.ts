import assert from "assert";
import { IReview } from "interfaces/documents/IReview";
import { reviewFailedValidation } from "messages/validation/reviewValidationMessages";
import { Review } from "models/Review";
import { Error } from "mongoose";
import sinon, { SinonStub } from "sinon";
import { invalidReviewInputs, validReviewInputs } from "tests/testInputs";

describe("Review model tests", () => {
  let validateSyncStub: SinonStub;
  let newReview: IReview;

  describe("Successful validation", () => {
    beforeEach(() => {
      sinon.restore();
      newReview = new Review(validReviewInputs);
      validateSyncStub = sinon.stub(Review.prototype, "validateSync");
    });

    it("model has valid inputs", () => {
      validateSyncStub.returns(undefined);

      const mongooseErrors = newReview.validateSync();

      assert.strictEqual(mongooseErrors, undefined);
    });
  });

  describe("Failed validation", () => {
    let validationError: Error.ValidationError;

    beforeEach(() => {
      sinon.restore();
      newReview = new Review();
      validationError = new Error.ValidationError();
      validateSyncStub = sinon.stub(Review.prototype, "validateSync");
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
      const mongooseErrors = newReview.validateSync();

      assert.notStrictEqual(mongooseErrors, undefined);
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
      const mongooseErrors = newReview.validateSync();

      assert.notStrictEqual(mongooseErrors, undefined);
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
      const mongooseErrors = newReview.validateSync();

      assert.notStrictEqual(mongooseErrors, undefined);
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
      const mongooseErrors = newReview.validateSync();

      assert.notStrictEqual(mongooseErrors, undefined);
      assert.strictEqual(
        mongooseErrors?.errors.description.message,
        reviewFailedValidation.DESCRIPTION_REQUIRED_MESSAGE
      );
    });

    it("description is too short", () => {
      validationError.errors = {
        description: new Error.ValidatorError({
          message: reviewFailedValidation.DESCRIPTION_BELOW_MIN_LENGTH_MESSAGE,
          path: "description",
          value: invalidReviewInputs.DESCRIPTION_TOO_SHORT,
        }),
      };

      validateSyncStub.returns(validationError);
      const mongooseErrors = newReview.validateSync();

      assert.notStrictEqual(mongooseErrors, undefined);
      assert.strictEqual(
        mongooseErrors?.errors.description.message,
        reviewFailedValidation.DESCRIPTION_BELOW_MIN_LENGTH_MESSAGE
      );
    });

    it("description is too long", () => {
      validationError.errors = {
        description: new Error.ValidatorError({
          message: reviewFailedValidation.DESCRIPTION_ABOVE_MAX_LENGTH_MESSAGE,
          path: "description",
          value: invalidReviewInputs.DESCRIPTION_TOO_LONG,
        }),
      };

      validateSyncStub.returns(validationError);
      const mongooseErrors = newReview.validateSync();

      assert.notStrictEqual(mongooseErrors, undefined);
      assert.strictEqual(
        mongooseErrors?.errors.description.message,
        reviewFailedValidation.DESCRIPTION_ABOVE_MAX_LENGTH_MESSAGE
      );
    });
  });
});
