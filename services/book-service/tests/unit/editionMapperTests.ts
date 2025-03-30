import assert from "assert";
import { validateSync } from "class-validator";
import { Edition } from "entities/Edition";
import { Request } from "express";
import {
  reqBodyToEdition,
  reqBodyToEditionUpdate,
} from "mappers/editionMapper";
import { editionFailedValidation } from "messages/validation/editionValidationMessages";
import { Genre } from "resources/enum/Genre";
import {
  invalidEditionInputs,
  validBookInputs,
  validEditionInputs,
} from "tests/testInputs";

describe("Edition mapper unit tests", () => {
  let req: Partial<Request>;
  let mockId: string;

  describe(`${reqBodyToEdition.name}`, () => {
    beforeEach(() => {
      mockId = "1";
    });

    describe("Positive scenario", () => {
      it("request has valid inputs", () => {
        req = {
          body: JSON.parse(
            JSON.stringify({
              isbn: validEditionInputs.isbn,
              publicationDate: validEditionInputs.publication_date,
              publisher: validEditionInputs.publisher,
              pageCount: validEditionInputs.page_count,
              bookFormat: validEditionInputs.book_format.toString(),
              bookLanguage: validEditionInputs.book_language,
              book: {
                id: mockId,
                title: validBookInputs.title,
                genre: validBookInputs.genre.toString(),
              },
            })
          ),
        };

        const newEdition = reqBodyToEdition(req as Request);
        const errors = validateSync(newEdition);

        assert(newEdition instanceof Edition);
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(newEdition.isbn, validEditionInputs.isbn);
        assert.strictEqual(
          newEdition.publicationDate.toISOString(),
          new Date(validEditionInputs.publication_date).toISOString()
        );
        assert.strictEqual(newEdition.publisher, validEditionInputs.publisher);
        assert.strictEqual(newEdition.pageCount, validEditionInputs.page_count);
        assert.strictEqual(
          newEdition.bookFormat.toString(),
          validEditionInputs.book_format
        );
        assert.strictEqual(
          newEdition.bookLanguage,
          validEditionInputs.book_language
        );
        assert.strictEqual(newEdition.book.title, validBookInputs.title);
        assert.strictEqual(newEdition.book.genre, Genre.FICTION);
      });
    });

    describe("Negative scenarios", () => {
      beforeEach(() => {
        req = {
          body: JSON.parse(
            JSON.stringify({
              isbn: validEditionInputs.isbn,
              publicationDate: validEditionInputs.publication_date,
              publisher: validEditionInputs.publisher,
              pageCount: validEditionInputs.page_count,
              bookFormat: validEditionInputs.book_format.toString(),
              bookLanguage: validEditionInputs.book_language,
              book: {
                id: mockId,
                title: validBookInputs.title,
                genre: validBookInputs.genre.toString(),
              },
            })
          ),
        };
      });

      it("isbn is invalid", () => {
        req.body.isbn = invalidEditionInputs.INVALID_ISBN;

        const newEdition = reqBodyToEdition(req as Request);
        const errors = validateSync(newEdition);

        assert(newEdition instanceof Edition);
        assert.strictEqual(errors.length, 1);
        assert.deepStrictEqual(errors[0].constraints, {
          isIsbn: editionFailedValidation.ISBN_INVALID_MESSAGE,
        });
      });

      it("publicationDate is invalid", () => {
        req.body.publicationDate = invalidEditionInputs.INVALID_DATE;

        const newEdition = reqBodyToEdition(req as Request);
        const errors = validateSync(newEdition);

        assert(newEdition instanceof Edition);
        assert.strictEqual(errors.length, 1);
        assert.deepStrictEqual(errors[0].constraints, {
          isDate: editionFailedValidation.PUBLICATION_DATE_INVALID_MESSAGE,
        });
      });

      it("publisher name is too short", () => {
        req.body.publisher = invalidEditionInputs.PUBLISHER_NAME_TOO_SHORT;

        const newEdition = reqBodyToEdition(req as Request);
        const errors = validateSync(newEdition);

        assert(newEdition instanceof Edition);
        assert.strictEqual(errors.length, 1);
        assert.deepStrictEqual(errors[0].constraints, {
          minLength: editionFailedValidation.PUBLISHER_BELOW_MIN_LENGTH_MESSAGE,
        });
      });

      it("publisher name is too long", () => {
        req.body.publisher = invalidEditionInputs.PUBLISHER_NAME_TOO_LONG;

        const newEdition = reqBodyToEdition(req as Request);
        const errors = validateSync(newEdition);

        assert(newEdition instanceof Edition);
        assert.strictEqual(errors.length, 1);
        assert.deepStrictEqual(errors[0].constraints, {
          maxLength: editionFailedValidation.PUBLISHER_ABOVE_MAX_LENGTH_MESSAGE,
        });
      });

      it("pageCount is negative", () => {
        req.body.pageCount = invalidEditionInputs.PAGE_COUNT_NEGATIVE;

        const newEdition = reqBodyToEdition(req as Request);
        const errors = validateSync(newEdition);

        assert(newEdition instanceof Edition);
        assert.strictEqual(errors.length, 1);
        assert.deepStrictEqual(errors[0].constraints, {
          isPositive: editionFailedValidation.PAGE_COUNT_NEGATIVE_MESSAGE,
          min: editionFailedValidation.PAGE_COUNT_MINIMUM_MESSAGE,
        });
      });

      it("pageCount is too low", () => {
        req.body.pageCount = invalidEditionInputs.PAGE_COUNT_MIN;

        const newEdition = reqBodyToEdition(req as Request);
        const errors = validateSync(newEdition);

        assert(newEdition instanceof Edition);
        assert.strictEqual(errors.length, 1);
        assert.deepStrictEqual(errors[0].constraints, {
          min: editionFailedValidation.PAGE_COUNT_MINIMUM_MESSAGE,
        });
      });

      it("bookFormat is invalid", () => {
        req.body.bookFormat = invalidEditionInputs.INVALID_BOOK_FORMAT;

        const newEdition = reqBodyToEdition(req as Request);
        const errors = validateSync(newEdition);

        assert(newEdition instanceof Edition);
        assert.strictEqual(errors.length, 1);
        assert.deepStrictEqual(errors[0].constraints, {
          isEnum: editionFailedValidation.BOOK_FORMAT_INVALID_MESSAGE,
        });
      });

      it("bookLanguage is too short", () => {
        req.body.bookLanguage = invalidEditionInputs.LANGUAGE_TOO_SHORT;

        const newEdition = reqBodyToEdition(req as Request);
        const errors = validateSync(newEdition);

        assert(newEdition instanceof Edition);
        assert.strictEqual(errors.length, 1);
        assert.deepStrictEqual(errors[0].constraints, {
          minLength: editionFailedValidation.LANGUAGE_MIN_LENGTH_MESSAGE,
        });
      });

      it("bookLanguage is invalid", () => {
        req.body.bookLanguage = invalidEditionInputs.INVALID_LANGUAGE;

        const newEdition = reqBodyToEdition(req as Request);
        const errors = validateSync(newEdition);

        assert(newEdition instanceof Edition);
        assert.strictEqual(errors.length, 1);
        assert.deepStrictEqual(errors[0].constraints, {
          matches: editionFailedValidation.LANGUAGE_INVALID_MESSAGE,
        });
      });
    });
  });

  describe(`${reqBodyToEditionUpdate.name}`, () => {
    beforeEach(() => {
      mockId = "1";
    });

    describe("Positive scenarios", () => {
      it("request has valid publication date", () => {
        req = {
          body: JSON.parse(
            JSON.stringify({
              id: mockId,
              publicationDate: validEditionInputs.publication_date,
            })
          ),
        };

        const updateObj = reqBodyToEditionUpdate(req as Request);
        const id = updateObj.id;
        const editionToUpdate = updateObj.edition;

        assert.strictEqual(Number.isInteger(id), true);
        assert.strictEqual(id, 1);
        assert.deepStrictEqual(editionToUpdate, {
          publicationDate: new Date(validEditionInputs.publication_date),
        });
      });

      it("request has valid publisher field", () => {
        req = {
          body: JSON.parse(
            JSON.stringify({
              id: mockId,
              publisher: validEditionInputs.publisher,
            })
          ),
        };

        const updateObj = reqBodyToEditionUpdate(req as Request);
        const id = updateObj.id;
        const editionToUpdate = updateObj.edition;

        assert.strictEqual(Number.isInteger(id), true);
        assert.strictEqual(id, 1);
        assert.deepStrictEqual(editionToUpdate, {
          publisher: validEditionInputs.publisher,
        });
      });
    });
  });
});
