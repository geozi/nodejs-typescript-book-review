import assert from "assert";
import { validateSync } from "class-validator";
import { Book } from "entities/Book";
import { Request } from "express";
import { reqBodyToBook, reqBodyToBookUpdate } from "mappers/bookMapper";
import { bookFailedValidation } from "messages/validation/bookValidationMessages";
import { Genre } from "resources/enum/Genre";
import { invalidBookInputs, validBookInputs } from "tests/testInputs";

describe("Book mapper unit tests", () => {
  let req: Partial<Request>;
  let mockId: number;

  describe(`${reqBodyToBook.name}`, () => {
    describe("Positive scenario", () => {
      it("request has valid inputs", () => {
        req = {
          body: JSON.parse(
            JSON.stringify({
              title: validBookInputs.title,
              genre: validBookInputs.genre.toString(),
            })
          ),
        };

        const newBook = reqBodyToBook(req as Request);
        const errors = validateSync(newBook);

        assert(newBook instanceof Book);
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(newBook.title, validBookInputs.title);
        assert.strictEqual(newBook.genre.toString(), validBookInputs.genre);
      });
    });

    describe("Negative scenarios", () => {
      beforeEach(() => {
        req = {
          body: JSON.parse(
            JSON.stringify({
              title: validBookInputs.title,
              genre: validBookInputs.genre.toString(),
            })
          ),
        };
      });

      it("title is too short", () => {
        req.body.title = invalidBookInputs.TITLE_TOO_SHORT;

        const newBook = reqBodyToBook(req as Request);
        const errors = validateSync(newBook);

        assert(newBook instanceof Book);
        assert.strictEqual(errors.length, 1);
        assert.deepStrictEqual(errors[0].constraints, {
          minLength: bookFailedValidation.TITLE_BELOW_MIN_LENGTH_MESSAGE,
        });
      });

      it("title is too long", () => {
        req.body.title = invalidBookInputs.TITLE_TOO_LONG;

        const newBook = reqBodyToBook(req as Request);
        const errors = validateSync(newBook);

        assert(newBook instanceof Book);
        assert.strictEqual(errors.length, 1);
        assert.deepStrictEqual(errors[0].constraints, {
          maxLength: bookFailedValidation.TITLE_ABOVE_MAX_LENGTH_MESSAGE,
        });
      });

      it("genre is invalid", () => {
        req.body.genre = invalidBookInputs.GENRE_INVALID;

        const newBook = reqBodyToBook(req as Request);
        const errors = validateSync(newBook);

        assert(newBook instanceof Book);
        assert.strictEqual(errors.length, 1);
        assert.deepStrictEqual(errors[0].constraints, {
          isEnum: bookFailedValidation.GENRE_INVALID_MESSAGE,
        });
      });

      it("title is undefined", () => {
        req.body.title = undefined;

        const newBook = reqBodyToBook(req as Request);
        const errors = validateSync(newBook);

        assert(newBook instanceof Book);
        assert.strictEqual(errors.length, 1);
        assert.deepStrictEqual(errors[0].constraints, {
          maxLength: bookFailedValidation.TITLE_ABOVE_MAX_LENGTH_MESSAGE,
          minLength: bookFailedValidation.TITLE_BELOW_MIN_LENGTH_MESSAGE,
          isString: bookFailedValidation.TITLE_NOT_STRING_MESSAGE,
        });
      });

      it("genre is undefined", () => {
        req.body.genre = undefined;

        const newBook = reqBodyToBook(req as Request);
        const errors = validateSync(newBook);

        assert(newBook instanceof Book);
        assert.strictEqual(errors.length, 1);
        assert.deepStrictEqual(errors[0].constraints, {
          isEnum: bookFailedValidation.GENRE_INVALID_MESSAGE,
        });
      });
    });
  });

  describe(`${reqBodyToBookUpdate.name}`, () => {
    describe("Positive scenarios", () => {
      beforeEach(() => {
        mockId = 1;

        req = {
          body: JSON.parse(
            JSON.stringify({
              id: mockId,
            })
          ),
        };
      });

      it("request has valid title", () => {
        req.body.title = validBookInputs.title;

        const updateObj = reqBodyToBookUpdate(req as Request);
        const id = updateObj.id;
        const bookToUpdate = updateObj.book;

        assert.strictEqual(Number.isInteger(id), true);
        assert.strictEqual(id, 1);
        assert.deepStrictEqual(bookToUpdate, {
          title: validBookInputs.title,
        });
      });

      it("request has valid genre", () => {
        req.body.genre = validBookInputs.genre.toString();

        const updateObj = reqBodyToBookUpdate(req as Request);
        const id = updateObj.id;
        const bookToUpdate = updateObj.book;

        assert.strictEqual(Number.isInteger(id), true);
        assert.strictEqual(id, 1);
        assert.deepStrictEqual(bookToUpdate, {
          genre: Genre.FICTION,
        });
      });
    });
  });
});
