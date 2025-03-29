import assert from "assert";
import { validateSync } from "class-validator";
import { Book } from "entities/Book";
import { Edition } from "entities/Edition";
import { editionFailedValidation } from "messages/validation/editionValidationMessages";
import { BookFormat } from "resources/enum/BookFormat";
import { invalidEditionInputs, validEditionInputs } from "tests/testInputs";

describe("Edition model entity unit tests", () => {
  let edition: Edition;
  let mockBook: Book;
  describe("Positive scenarios", () => {
    beforeEach(() => {
      mockBook = new Book();
      edition = new Edition();
      edition.isbn = validEditionInputs.isbn;
      edition.publicationDate = new Date(validEditionInputs.publication_date);
      edition.publisher = validEditionInputs.publisher;
      edition.pageCount = validEditionInputs.page_count;
      edition.bookFormat = BookFormat.HARDCOVER;
      edition.bookLanguage = validEditionInputs.book_language;
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
        edition.isbn = validEditionInputs.isbn;
        edition.publicationDate = new Date(validEditionInputs.publication_date);
        edition.publisher = validEditionInputs.publisher;
        edition.pageCount = validEditionInputs.page_count;
        edition.bookFormat = BookFormat.HARDCOVER;
        edition.bookLanguage = validEditionInputs.book_language;
        edition.book = mockBook;
      });

      it("isbn is invalid", () => {
        edition.isbn = invalidEditionInputs.INVALID_ISBN;

        const errors = validateSync(edition);

        assert.strictEqual(errors.length, 1);
        assert.deepEqual(errors[0].constraints, {
          isIsbn: editionFailedValidation.ISBN_INVALID_MESSAGE,
        });
      });

      it("publication_date is invalid", () => {
        const invalidDate = new Date(invalidEditionInputs.INVALID_DATE);
        edition.publicationDate = invalidDate;

        const errors = validateSync(edition);

        assert.strictEqual(errors.length, 1);
        assert.strictEqual(errors[0].value, invalidDate);
        assert.deepEqual(errors[0].constraints, {
          isDate: editionFailedValidation.PUBLICATION_DATE_INVALID_MESSAGE,
        });
      });

      it("publisher name is too short", () => {
        edition.publisher = invalidEditionInputs.PUBLISHER_NAME_TOO_SHORT;

        const errors = validateSync(edition);

        assert.strictEqual(errors.length, 1);
        assert.strictEqual(
          errors[0].value,
          invalidEditionInputs.PUBLISHER_NAME_TOO_SHORT
        );
        assert.deepEqual(errors[0].constraints, {
          minLength: editionFailedValidation.PUBLISHER_BELOW_MIN_LENGTH_MESSAGE,
        });
      });

      it("publisher name is too long", () => {
        edition.publisher = invalidEditionInputs.PUBLISHER_NAME_TOO_LONG;

        const errors = validateSync(edition);

        assert.strictEqual(errors.length, 1);
        assert.strictEqual(
          errors[0].value,
          invalidEditionInputs.PUBLISHER_NAME_TOO_LONG
        );
        assert.deepEqual(errors[0].constraints, {
          maxLength: editionFailedValidation.PUBLISHER_ABOVE_MAX_LENGTH_MESSAGE,
        });
      });

      it("page_count is a negative number", () => {
        edition.pageCount = invalidEditionInputs.PAGE_COUNT_NEGATIVE;

        const errors = validateSync(edition);

        assert.strictEqual(errors.length, 1);
        assert.strictEqual(
          errors[0].value,
          invalidEditionInputs.PAGE_COUNT_NEGATIVE
        );
        assert.deepEqual(errors[0].constraints, {
          min: editionFailedValidation.PAGE_COUNT_MINIMUM_MESSAGE,
          isPositive: editionFailedValidation.PAGE_COUNT_NEGATIVE_MESSAGE,
        });
      });

      it("page_count is too small", () => {
        edition.pageCount = invalidEditionInputs.PAGE_COUNT_MIN;

        const errors = validateSync(edition);

        assert.strictEqual(errors.length, 1);
        assert.strictEqual(
          errors[0].value,
          invalidEditionInputs.PAGE_COUNT_MIN
        );
        assert.deepEqual(errors[0].constraints, {
          min: editionFailedValidation.PAGE_COUNT_MINIMUM_MESSAGE,
        });
      });

      it("book_language is invalid", () => {
        edition.bookLanguage = invalidEditionInputs.INVALID_LANGUAGE;

        const errors = validateSync(edition);

        assert.strictEqual(errors.length, 1);
        assert.strictEqual(
          errors[0].value,
          invalidEditionInputs.INVALID_LANGUAGE
        );
        assert.deepEqual(errors[0].constraints, {
          matches: editionFailedValidation.LANGUAGE_INVALID_MESSAGE,
        });
      });

      it("book_language is too short", () => {
        edition.bookLanguage = invalidEditionInputs.LANGUAGE_TOO_SHORT;

        const errors = validateSync(edition);

        assert.strictEqual(errors.length, 1);
        assert.strictEqual(
          errors[0].value,
          invalidEditionInputs.LANGUAGE_TOO_SHORT
        );
        assert.deepEqual(errors[0].constraints, {
          minLength: editionFailedValidation.LANGUAGE_MIN_LENGTH_MESSAGE,
        });
      });
    });
  });
});
