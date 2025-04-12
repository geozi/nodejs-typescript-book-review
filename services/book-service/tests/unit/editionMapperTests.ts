import assert from "assert";
import { validateSync } from "class-validator";
import { AppDataSource } from "db/dataSource";
import { Book } from "entities/Book";
import { Edition } from "entities/Edition";
import { Request } from "express";
import {
  reqBodyToEdition,
  reqBodyToEditionUpdate,
} from "mappers/editionMapper";
import { editionFailedValidation } from "messages/validation/editionValidationMessages";
import sinon, { SinonStub } from "sinon";
import { invalidEditionInputs, validEditionInputs } from "tests/testInputs";

describe("Edition mapper unit tests", () => {
  let req: Partial<Request>;
  let bookFindOneStub: SinonStub;
  let mockId: number;
  let mockBook: Book;

  describe(`${reqBodyToEdition.name}`, () => {
    describe("Positive scenario", () => {
      beforeEach(() => {
        // Restore stubs
        sinon.restore();

        // Stubs
        bookFindOneStub = sinon.stub(
          AppDataSource.getRepository(Book),
          "findOneBy"
        );

        // Mocks
        mockId = 1;
        mockBook = new Book();
        mockBook.id = mockId;

        // HTTP request
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
              },
            })
          ),
        };
      });

      it("request has valid inputs", async () => {
        bookFindOneStub.resolves(mockBook);

        const newEdition = await reqBodyToEdition(req as Request);
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
        assert.strictEqual(newEdition.book.id, mockId);
      });
    });

    describe("Negative scenarios", () => {
      beforeEach(() => {
        // Restore stubs
        sinon.restore();

        // Stubs
        bookFindOneStub = sinon.stub(
          AppDataSource.getRepository(Book),
          "findOneBy"
        );

        // Mocks
        mockId = 1;
        mockBook = new Book();
        mockBook.id = mockId;

        // HTTP request
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
              },
            })
          ),
        };

        bookFindOneStub.resolves(mockBook);
      });

      it("isbn is invalid", async () => {
        req.body.isbn = invalidEditionInputs.INVALID_ISBN;

        const newEdition = await reqBodyToEdition(req as Request);
        const errors = validateSync(newEdition);

        assert(newEdition instanceof Edition);
        assert.strictEqual(errors.length, 1);
        assert.deepStrictEqual(errors[0].constraints, {
          isIsbn: editionFailedValidation.ISBN_INVALID_MESSAGE,
        });
      });

      it("publicationDate is invalid", async () => {
        req.body.publicationDate = invalidEditionInputs.INVALID_DATE;

        const newEdition = await reqBodyToEdition(req as Request);
        const errors = validateSync(newEdition);

        assert(newEdition instanceof Edition);
        assert.strictEqual(errors.length, 1);
        assert.deepStrictEqual(errors[0].constraints, {
          isDate: editionFailedValidation.PUBLICATION_DATE_INVALID_MESSAGE,
        });
      });

      it("publisher name is too short", async () => {
        req.body.publisher = invalidEditionInputs.PUBLISHER_NAME_TOO_SHORT;

        const newEdition = await reqBodyToEdition(req as Request);
        const errors = validateSync(newEdition);

        assert(newEdition instanceof Edition);
        assert.strictEqual(errors.length, 1);
        assert.deepStrictEqual(errors[0].constraints, {
          minLength: editionFailedValidation.PUBLISHER_BELOW_MIN_LENGTH_MESSAGE,
        });
      });

      it("publisher name is too long", async () => {
        req.body.publisher = invalidEditionInputs.PUBLISHER_NAME_TOO_LONG;

        const newEdition = await reqBodyToEdition(req as Request);
        const errors = validateSync(newEdition);

        assert(newEdition instanceof Edition);
        assert.strictEqual(errors.length, 1);
        assert.deepStrictEqual(errors[0].constraints, {
          maxLength: editionFailedValidation.PUBLISHER_ABOVE_MAX_LENGTH_MESSAGE,
        });
      });

      it("pageCount is negative", async () => {
        req.body.pageCount = invalidEditionInputs.PAGE_COUNT_NEGATIVE;

        const newEdition = await reqBodyToEdition(req as Request);
        const errors = validateSync(newEdition);

        assert(newEdition instanceof Edition);
        assert.strictEqual(errors.length, 1);
        assert.deepStrictEqual(errors[0].constraints, {
          isPositive: editionFailedValidation.PAGE_COUNT_NEGATIVE_MESSAGE,
          min: editionFailedValidation.PAGE_COUNT_MINIMUM_MESSAGE,
        });
      });

      it("pageCount is too low", async () => {
        req.body.pageCount = invalidEditionInputs.PAGE_COUNT_MIN;

        const newEdition = await reqBodyToEdition(req as Request);
        const errors = validateSync(newEdition);

        assert(newEdition instanceof Edition);
        assert.strictEqual(errors.length, 1);
        assert.deepStrictEqual(errors[0].constraints, {
          min: editionFailedValidation.PAGE_COUNT_MINIMUM_MESSAGE,
        });
      });

      it("bookFormat is invalid", async () => {
        req.body.bookFormat = invalidEditionInputs.INVALID_BOOK_FORMAT;

        const newEdition = await reqBodyToEdition(req as Request);
        const errors = validateSync(newEdition);

        assert(newEdition instanceof Edition);
        assert.strictEqual(errors.length, 1);
        assert.deepStrictEqual(errors[0].constraints, {
          isEnum: editionFailedValidation.BOOK_FORMAT_INVALID_MESSAGE,
        });
      });

      it("bookLanguage is too short", async () => {
        req.body.bookLanguage = invalidEditionInputs.LANGUAGE_TOO_SHORT;

        const newEdition = await reqBodyToEdition(req as Request);
        const errors = validateSync(newEdition);

        assert(newEdition instanceof Edition);
        assert.strictEqual(errors.length, 1);
        assert.deepStrictEqual(errors[0].constraints, {
          minLength: editionFailedValidation.LANGUAGE_MIN_LENGTH_MESSAGE,
        });
      });

      it("bookLanguage is invalid", async () => {
        req.body.bookLanguage = invalidEditionInputs.INVALID_LANGUAGE;

        const newEdition = await reqBodyToEdition(req as Request);
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
    describe("Positive scenarios", () => {
      beforeEach(() => {
        // Mocks
        mockId = 1;

        // HTTP request
        req = {
          body: JSON.parse(
            JSON.stringify({
              id: mockId,
            })
          ),
        };
      });
      it("request has valid publication date", async () => {
        req.body.publicationDate = validEditionInputs.publication_date;

        const updateObj = await reqBodyToEditionUpdate(req as Request);
        const id = updateObj.id;
        const editionToUpdate = updateObj.edition;

        assert.strictEqual(Number.isInteger(id), true);
        assert.strictEqual(id, 1);
        assert.deepStrictEqual(editionToUpdate, {
          publicationDate: new Date(validEditionInputs.publication_date),
        });
      });

      it("request has valid publisher field", async () => {
        req.body.publisher = validEditionInputs.publisher;
        const updateObj = await reqBodyToEditionUpdate(req as Request);
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
