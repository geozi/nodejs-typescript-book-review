import { Book } from "entities/Book";
import { Edition } from "entities/Edition";
import { invalidEditionInput, validEditionInput } from "../testInputs";
import { validateSync } from "class-validator";
import assert from "assert";
import { editionFailedValidation } from "messages/editionValidationMessages";

describe("Edition model entity unit tests", () => {
  let edition: Edition;
  let mockBook: Book;
  describe("Positive scenarios", () => {
    beforeEach(() => {
      mockBook = new Book();
      edition = new Edition();
      edition.isbn = validEditionInput.isbn;
      edition.publication_date = new Date(validEditionInput.publication_date);
      edition.publisher = validEditionInput.publisher;
      edition.page_count = validEditionInput.page_count;
      edition.book_format = validEditionInput.book_format;
      edition.book_language = validEditionInput.book_language;
      edition.book = mockBook;
    });

    it("edition has valid inputs", () => {
      const errors = validateSync(edition);

      assert.strictEqual(errors.length, 0);
      assert.strictEqual(edition.book.id, mockBook.id);
    });
  });
  describe("Negative scenarios", () => {
    describe("validation-oriented", () => {
      beforeEach(() => {
        mockBook = new Book();
        edition = new Edition();
        edition.isbn = validEditionInput.isbn;
        edition.publication_date = new Date(validEditionInput.publication_date);
        edition.publisher = validEditionInput.publisher;
        edition.page_count = validEditionInput.page_count;
        edition.book_format = validEditionInput.book_format;
        edition.book_language = validEditionInput.book_language;
        edition.book = mockBook;
      });

      it("isbn is invalid", () => {
        edition.isbn = invalidEditionInput.INVALID_ISBN;

        const errors = validateSync(edition);

        assert.strictEqual(errors.length, 1);
        assert.deepEqual(errors[0].constraints, {
          isIsbn: editionFailedValidation.ISBN_INVALID_MESSAGE,
        });
      });

      it("publication_date is invalid", () => {
        const invalidDate = new Date(invalidEditionInput.INVALID_DATE);
        edition.publication_date = invalidDate;

        const errors = validateSync(edition);

        assert.strictEqual(errors.length, 1);
        assert.strictEqual(errors[0].value, invalidDate);
        assert.deepEqual(errors[0].constraints, {
          isDate: editionFailedValidation.PUBLICATION_DATE_INVALID_MESSAGE,
        });
      });
    });
  });
});
