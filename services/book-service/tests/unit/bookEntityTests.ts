import { Book } from "entities/Book";
import { validBookInput } from "../testInputs";
import { validateSync } from "class-validator";
import assert from "assert";

describe("Book model entity unit tests", () => {
  let book: Book;

  describe("Positive scenarios", () => {
    beforeEach(() => {
      book = new Book();
      book.title = validBookInput.title;
      book.genre = validBookInput.genre;
    });

    it("book has valid inputs", () => {
      const errors = validateSync(book);

      assert.strictEqual(errors.length, 0);
      assert.strictEqual(book.title, validBookInput.title);
      assert.strictEqual(book.genre, validBookInput.genre);
    });
  });

  describe("Negative scenarios", () => {
    beforeEach(() => {
      book = new Book();
      book.title = validBookInput.title;
      book.genre = validBookInput.genre;
    });
  });
});
