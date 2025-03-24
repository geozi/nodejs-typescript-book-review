import { Book } from "entities/Book";
import { invalidBookInputs, validBookInputs } from "../testInputs";
import { validateSync } from "class-validator";
import assert from "assert";
import { bookFailedValidation } from "messages/validation/bookValidationMessages";

describe("Book model entity unit tests", () => {
  let book: Book;

  describe("Positive scenarios", () => {
    beforeEach(() => {
      book = new Book();
      book.title = validBookInputs.title;
      book.genre = validBookInputs.genre;
    });

    it("book has valid inputs", () => {
      const errors = validateSync(book);

      assert.strictEqual(errors.length, 0);
      assert.strictEqual(book.title, validBookInputs.title);
      assert.strictEqual(book.genre, validBookInputs.genre);
    });
  });

  describe("Negative scenarios", () => {
    beforeEach(() => {
      book = new Book();
      book.title = validBookInputs.title;
      book.genre = validBookInputs.genre;
    });

    it("title is too short", () => {
      book.title = invalidBookInputs.TITLE_TOO_SHORT;

      const errors = validateSync(book);

      assert.strictEqual(errors.length, 1);
      assert.strictEqual(book.title, invalidBookInputs.TITLE_TOO_SHORT);
      assert.deepEqual(errors[0].constraints, {
        minLength: bookFailedValidation.TITLE_BELOW_MIN_LENGTH_MESSAGE,
      });
    });

    it("title is too long", () => {
      book.title = invalidBookInputs.TITLE_TOO_LONG;

      const errors = validateSync(book);

      assert.strictEqual(errors.length, 1);
      assert.strictEqual(book.title, invalidBookInputs.TITLE_TOO_LONG);
      assert.deepEqual(errors[0].constraints, {
        maxLength: bookFailedValidation.TITLE_ABOVE_MAX_LENGTH_MESSAGE,
      });
    });
  });
});
