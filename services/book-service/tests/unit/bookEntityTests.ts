import { Book } from "entities/Book";
import { validBookInputs } from "../testInputs";
import { validateSync } from "class-validator";
import assert from "assert";

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
  });
});
