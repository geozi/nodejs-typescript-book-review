import { Author } from "entities/Author";
import { Request } from "express";
import { reqBodyToAuthor, reqBodyToAuthorUpdate } from "mappers/authorMapper";
import assert from "assert";
import { invalidAuthorInputs, validAuthorInputs } from "../../tests/testInputs";
import { validateSync } from "class-validator";
import { authorFailedValidation } from "messages/validation/authorValidationMessages";

describe.only("Author mapper unit tests", () => {
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
        assert.strictEqual(newAuthor.first_name, validAuthorInputs.firstName);
        assert.strictEqual(newAuthor.last_name, validAuthorInputs.lastName);
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
          matches: authorFailedValidation.FIRST_NAME_INVALID,
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
          matches: authorFailedValidation.LAST_NAME_INVALID,
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
          matches: authorFailedValidation.FIRST_NAME_INVALID,
          minLength: authorFailedValidation.FIRST_NAME_BELOW_MIN_LENGTH_MESSAGE,
          isString: "first_name must be a string",
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
          matches: authorFailedValidation.LAST_NAME_INVALID,
          minLength: authorFailedValidation.LAST_NAME_BELOW_MIN_LENGTH_MESSAGE,
          isString: "last_name must be a string",
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

        const updateArray = reqBodyToAuthorUpdate(req as Request);
        const id = updateArray[0];
        const authorToUpdate = updateArray[1];

        assert.strictEqual(Number.isInteger(id), true);
        assert.strictEqual(id, 1);
        assert.deepStrictEqual(authorToUpdate, {
          first_name: validAuthorInputs.firstName,
          last_name: undefined,
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

        const updateArray = reqBodyToAuthorUpdate(req as Request);
        const id = updateArray[0];
        const authorToUpdate = updateArray[1];

        assert.strictEqual(Number.isInteger(id), true);
        assert.strictEqual(id, 1);
        assert.deepStrictEqual(authorToUpdate, {
          first_name: undefined,
          last_name: validAuthorInputs.lastName,
        });
      });
    });
  });
});
