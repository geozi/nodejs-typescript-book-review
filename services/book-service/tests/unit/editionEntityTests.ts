import assert from "assert";
import { validateSync } from "class-validator";
import { Book } from "entities/Book";
import { Edition } from "entities/Edition";
import { editionFailedValidation } from "messages/validation/editionValidationMessages";
import { invalidEditionInputs, validEditionInputs } from "tests/testInputs";

describe("Edition model entity unit tests", () => {
  let mockEdition: Edition;
  let mockBook: Book;

  describe("Positive scenarios", () => {
    beforeEach(() => {
      // Mocks
      mockBook = new Book();
      mockEdition = new Edition();
      mockEdition.isbn = validEditionInputs.isbn;
      mockEdition.publicationDate = new Date(
        validEditionInputs.publication_date
      );
      mockEdition.publisher = validEditionInputs.publisher;
      mockEdition.pageCount = validEditionInputs.page_count;
      mockEdition.bookFormat = validEditionInputs.book_format;
      mockEdition.bookLanguage = validEditionInputs.book_language;
      mockEdition.book = mockBook;
    });

    it("edition has valid inputs", () => {
      const errors = validateSync(mockEdition);

      assert.strictEqual(errors.length, 0);
      assert.strictEqual(mockEdition.book.id, mockBook.id);
    });
  });

  describe("Negative scenarios", () => {
    describe("validation-oriented", () => {
      beforeEach(() => {
        // Mocks
        mockBook = new Book();
        mockEdition = new Edition();
        mockEdition.isbn = validEditionInputs.isbn;
        mockEdition.publicationDate = new Date(
          validEditionInputs.publication_date
        );
        mockEdition.publisher = validEditionInputs.publisher;
        mockEdition.pageCount = validEditionInputs.page_count;
        mockEdition.bookFormat = validEditionInputs.book_format;
        mockEdition.bookLanguage = validEditionInputs.book_language;
        mockEdition.book = mockBook;
      });

      it("isbn is invalid", () => {
        mockEdition.isbn = invalidEditionInputs.INVALID_ISBN;

        const errors = validateSync(mockEdition);

        assert.strictEqual(errors.length, 1);
        assert.deepEqual(errors[0].constraints, {
          isIsbn: editionFailedValidation.ISBN_INVALID_MESSAGE,
        });
      });

      it("publication_date is invalid", () => {
        const invalidDate = new Date(invalidEditionInputs.INVALID_DATE);
        mockEdition.publicationDate = invalidDate;

        const errors = validateSync(mockEdition);

        assert.strictEqual(errors.length, 1);
        assert.strictEqual(errors[0].value, invalidDate);
        assert.deepEqual(errors[0].constraints, {
          isDate: editionFailedValidation.PUBLICATION_DATE_INVALID_MESSAGE,
        });
      });

      it("publisher name is too short", () => {
        mockEdition.publisher = invalidEditionInputs.PUBLISHER_NAME_TOO_SHORT;

        const errors = validateSync(mockEdition);

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
        mockEdition.publisher = invalidEditionInputs.PUBLISHER_NAME_TOO_LONG;

        const errors = validateSync(mockEdition);

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
        mockEdition.pageCount = invalidEditionInputs.PAGE_COUNT_NEGATIVE;

        const errors = validateSync(mockEdition);

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
        mockEdition.pageCount = invalidEditionInputs.PAGE_COUNT_MIN;

        const errors = validateSync(mockEdition);

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
        mockEdition.bookLanguage = invalidEditionInputs.INVALID_LANGUAGE;

        const errors = validateSync(mockEdition);

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
        mockEdition.bookLanguage = invalidEditionInputs.LANGUAGE_TOO_SHORT;

        const errors = validateSync(mockEdition);

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
