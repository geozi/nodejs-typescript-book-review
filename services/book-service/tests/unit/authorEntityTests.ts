import { Author } from "entities/Author";
import { invalidAuthorInputs, validAuthorInputs } from "../testInputs";
import { validateSync } from "class-validator";
import assert from "assert";
import { authorFailedValidation } from "messages/validation/authorValidationMessages";

describe("Author model entity unit tests", () => {
  let author: Author;

  describe("Positive scenarios", () => {
    beforeEach(() => {
      author = new Author();
      author.firstName = validAuthorInputs.firstName;
      author.lastName = validAuthorInputs.lastName;
    });

    it("author has valid inputs", () => {
      const errors = validateSync(author);

      assert.strictEqual(errors.length, 0);
      assert.strictEqual(author.firstName, validAuthorInputs.firstName);
      assert.strictEqual(author.lastName, validAuthorInputs.lastName);
    });
  });

  describe("Negative scenarios", () => {
    describe("validation-oriented", () => {
      beforeEach(() => {
        author = new Author();
        author.firstName = validAuthorInputs.firstName;
        author.lastName = validAuthorInputs.lastName;
      });

      it("firstName is invalid", () => {
        author.firstName = invalidAuthorInputs.NAME_INVALID;

        const errors = validateSync(author);

        assert.strictEqual(errors[0].value, invalidAuthorInputs.NAME_INVALID);
        assert.deepStrictEqual(errors[0].constraints, {
          matches: authorFailedValidation.FIRST_NAME_INVALID_MESSAGE,
        });
      });

      it("firstName is too short", () => {
        author.firstName = invalidAuthorInputs.NAME_TOO_SHORT;

        const errors = validateSync(author);

        assert.strictEqual(errors[0].value, invalidAuthorInputs.NAME_TOO_SHORT);
        assert.deepStrictEqual(errors[0].constraints, {
          minLength: authorFailedValidation.FIRST_NAME_BELOW_MIN_LENGTH_MESSAGE,
        });
      });

      it("lastName is invalid", () => {
        author.lastName = invalidAuthorInputs.NAME_INVALID;

        const errors = validateSync(author);

        assert.strictEqual(errors[0].value, invalidAuthorInputs.NAME_INVALID);
        assert.deepStrictEqual(errors[0].constraints, {
          matches: authorFailedValidation.LAST_NAME_INVALID_MESSAGE,
        });
      });

      it("lastName is too short", () => {
        author.lastName = invalidAuthorInputs.NAME_TOO_SHORT;

        const errors = validateSync(author);

        assert.strictEqual(errors[0].value, invalidAuthorInputs.NAME_TOO_SHORT);
        assert.deepStrictEqual(errors[0].constraints, {
          minLength: authorFailedValidation.LAST_NAME_BELOW_MIN_LENGTH_MESSAGE,
        });
      });

      it("firstName and lastName are invalid", () => {
        author.lastName = invalidAuthorInputs.NAME_INVALID;
        author.firstName = invalidAuthorInputs.NAME_INVALID;

        const errors = validateSync(author);

        assert.strictEqual(errors.length, 2);
      });
    });
  });
});
