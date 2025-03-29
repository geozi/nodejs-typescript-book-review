import assert from "assert";
import { validateSync } from "class-validator";
import { Book } from "entities/Book";
import { bookFailedValidation } from "messages/validation/bookValidationMessages";
import { Genre } from "resources/enum/Genre";
import { invalidBookInputs, validBookInputs } from "tests/testInputs";

describe("Book model entity unit tests", () => {
  let book: Book;

  describe("Positive scenarios", () => {
    beforeEach(() => {
      book = new Book();
      book.title = validBookInputs.title;
      book.genre = Genre.FICTION;
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
      book.genre = Genre.FICTION;
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
