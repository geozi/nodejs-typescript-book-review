import { Author } from "entities/Author";
import { Request } from "express";
import { reqBodyToAuthor, reqBodyToAuthorUpdate } from "mappers/authorMapper";
import assert from "assert";
import { invalidAuthorInputs, validAuthorInputs } from "../../tests/testInputs";
import { validateSync } from "class-validator";
import { authorFailedValidation } from "messages/validation/authorValidationMessages";

describe("Author mapper unit tests", () => {
  let req: Partial<Request>;

  describe(`${reqBodyToAuthor.name}`, () => {
    describe("Positive scenario", () => {
      it("request has valid inputs", () => {
        req = {
          body: JSON.parse(
            JSON.stringify({
              firstName: validAuthorInputs.firstName,
              lastName: validAuthorInputs.lastName,
            })
          ),
        };

        const newAuthor = reqBodyToAuthor(req as Request);
        const errors = validateSync(newAuthor);

        assert(newAuthor instanceof Author);
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(newAuthor.firstName, validAuthorInputs.firstName);
        assert.strictEqual(newAuthor.lastName, validAuthorInputs.lastName);
      });
    });

    describe("Negative scenarios", () => {
      it("firstName is too short", () => {
        req = {
          body: JSON.parse(
            JSON.stringify({
              firstName: invalidAuthorInputs.NAME_TOO_SHORT,
              lastName: validAuthorInputs.lastName,
            })
          ),
        };

        const newAuthor = reqBodyToAuthor(req as Request);
        const errors = validateSync(newAuthor);

        assert(newAuthor instanceof Author);
        assert.strictEqual(errors.length, 1);
        assert.deepStrictEqual(errors[0].constraints, {
          minLength: authorFailedValidation.FIRST_NAME_BELOW_MIN_LENGTH_MESSAGE,
        });
      });

      it("firstName is invalid", () => {
        req = {
          body: JSON.parse(
            JSON.stringify({
              firstName: invalidAuthorInputs.NAME_INVALID,
              lastName: validAuthorInputs.lastName,
            })
          ),
        };

        const newAuthor = reqBodyToAuthor(req as Request);
        const errors = validateSync(newAuthor);

        assert(newAuthor instanceof Author);
        assert.strictEqual(errors.length, 1);
        assert.deepStrictEqual(errors[0].constraints, {
          matches: authorFailedValidation.FIRST_NAME_INVALID_MESSAGE,
        });
      });

      it("lastName is too short", () => {
        req = {
          body: JSON.parse(
            JSON.stringify({
              firstName: validAuthorInputs.firstName,
              lastName: invalidAuthorInputs.NAME_TOO_SHORT,
            })
          ),
        };

        const newAuthor = reqBodyToAuthor(req as Request);
        const errors = validateSync(newAuthor);

        assert(newAuthor instanceof Author);
        assert.strictEqual(errors.length, 1);
        assert.deepStrictEqual(errors[0].constraints, {
          minLength: authorFailedValidation.LAST_NAME_BELOW_MIN_LENGTH_MESSAGE,
        });
      });

      it("lastName is invalid", () => {
        req = {
          body: JSON.parse(
            JSON.stringify({
              firstName: validAuthorInputs.firstName,
              lastName: invalidAuthorInputs.NAME_INVALID,
            })
          ),
        };

        const newAuthor = reqBodyToAuthor(req as Request);
        const errors = validateSync(newAuthor);

        assert(newAuthor instanceof Author);
        assert.strictEqual(errors.length, 1);
        assert.deepStrictEqual(errors[0].constraints, {
          matches: authorFailedValidation.LAST_NAME_INVALID_MESSAGE,
        });
      });

      it("firstName is undefined", () => {
        req = {
          body: JSON.parse(
            JSON.stringify({
              firstName: undefined,
              lastName: validAuthorInputs.lastName,
            })
          ),
        };

        const newAuthor = reqBodyToAuthor(req as Request);
        const errors = validateSync(newAuthor);

        assert(newAuthor instanceof Author);
        assert.strictEqual(errors.length, 1);
        assert.deepStrictEqual(errors[0].constraints, {
          matches: authorFailedValidation.FIRST_NAME_INVALID_MESSAGE,
          minLength: authorFailedValidation.FIRST_NAME_BELOW_MIN_LENGTH_MESSAGE,
          isString: authorFailedValidation.FIRST_NAME_NOT_STRING_MESSAGE,
        });
      });

      it("lastName is undefined", () => {
        req = {
          body: JSON.parse(
            JSON.stringify({
              firstName: validAuthorInputs.firstName,
              lastName: undefined,
            })
          ),
        };

        const newAuthor = reqBodyToAuthor(req as Request);
        const errors = validateSync(newAuthor);

        assert(newAuthor instanceof Author);
        assert.strictEqual(errors.length, 1);
        assert.deepStrictEqual(errors[0].constraints, {
          matches: authorFailedValidation.LAST_NAME_INVALID_MESSAGE,
          minLength: authorFailedValidation.LAST_NAME_BELOW_MIN_LENGTH_MESSAGE,
          isString: authorFailedValidation.LAST_NAME_NOT_STRING_MESSAGE,
        });
      });
    });
  });

  describe(`${reqBodyToAuthorUpdate.name}`, () => {
    describe("Positive scenarios", () => {
      it("request has valid firstName", () => {
        req = {
          body: JSON.parse(
            JSON.stringify({
              id: 1,
              firstName: validAuthorInputs.firstName,
            })
          ),
        };

        const updateObj = reqBodyToAuthorUpdate(req as Request);
        const id = updateObj.id;
        const authorToUpdate = updateObj.author;

        assert.strictEqual(Number.isInteger(id), true);
        assert.strictEqual(id, 1);
        assert.deepStrictEqual(authorToUpdate, {
          firstName: validAuthorInputs.firstName,
        });
      });

      it("request has valid lastName", () => {
        req = {
          body: JSON.parse(
            JSON.stringify({
              id: 1,
              lastName: validAuthorInputs.lastName,
            })
          ),
        };

        const updateObj = reqBodyToAuthorUpdate(req as Request);
        const id = updateObj.id;
        const authorToUpdate = updateObj.author;

        assert.strictEqual(Number.isInteger(id), true);
        assert.strictEqual(id, 1);
        assert.deepStrictEqual(authorToUpdate, {
          lastName: validAuthorInputs.lastName,
        });
      });
    });
  });
});
