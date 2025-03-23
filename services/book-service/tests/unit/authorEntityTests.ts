import { Author } from "entities/Author";
import { invalidAuthorInput, validAuthorInput } from "../testInputs";
import { validateSync } from "class-validator";
import assert from "assert";
import { authorFailedValidation } from "messages/authorValidationMessages";

describe("Author model entity unit tests", () => {
  let author: Author;
  describe("Positive scenarios", () => {
    beforeEach(() => {
      author = new Author(
        validAuthorInput.firstName,
        validAuthorInput.lastName
      );
    });

    it("author has valid inputs", () => {
      const errors = validateSync(author);

      assert.strictEqual(errors.length, 0);
      assert.strictEqual(author.first_name, validAuthorInput.firstName);
      assert.strictEqual(author.last_name, validAuthorInput.lastName);
    });
  });
  describe("Negative scenarios", () => {
    describe("validation-oriented", () => {
      beforeEach(() => {
        author = new Author(
          validAuthorInput.firstName,
          validAuthorInput.lastName
        );
      });

      it("first_name is invalid", () => {
        author.first_name = invalidAuthorInput.NAME_INVALID;

        const errors = validateSync(author);

        assert.strictEqual(errors[0].value, invalidAuthorInput.NAME_INVALID);
        assert.deepStrictEqual(errors[0].constraints, {
          matches: authorFailedValidation.FIRST_NAME_INVALID,
        });
      });

      it("first_name is too short", () => {
        author.first_name = invalidAuthorInput.NAME_TOO_SHORT;

        const errors = validateSync(author);

        assert.strictEqual(errors[0].value, invalidAuthorInput.NAME_TOO_SHORT);
        assert.deepStrictEqual(errors[0].constraints, {
          minLength: authorFailedValidation.FIRST_NAME_BELOW_MIN_LENGTH_MESSAGE,
        });
      });

      it("last_name is invalid", () => {
        author.last_name = invalidAuthorInput.NAME_INVALID;

        const errors = validateSync(author);

        assert.strictEqual(errors[0].value, invalidAuthorInput.NAME_INVALID);
        assert.deepStrictEqual(errors[0].constraints, {
          matches: authorFailedValidation.LAST_NAME_INVALID,
        });
      });

      it("last_name is too short", () => {
        author.last_name = invalidAuthorInput.NAME_TOO_SHORT;

        const errors = validateSync(author);

        assert.strictEqual(errors[0].value, invalidAuthorInput.NAME_TOO_SHORT);
        assert.deepStrictEqual(errors[0].constraints, {
          minLength: authorFailedValidation.LAST_NAME_BELOW_MIN_LENGTH_MESSAGE,
        });
      });
    });
  });
});
