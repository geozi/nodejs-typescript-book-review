import assert from "assert";
import { callEditionAddition } from "controllers/editionController";
import { AppDataSource } from "db/dataSource";
import { Book } from "entities/Book";
import { Edition } from "entities/Edition";
import { Request, Response } from "express";
import { bookControllerResponseMessages } from "messages/response/bookControllerResponseMessages";
import { commonResponseMessages } from "messages/response/commonResponseMessages";
import { editionControllerResponseMessages } from "messages/response/editionControllerResponseMessages";
import { editionFailedValidation } from "messages/validation/editionValidationMessages";
import { apiVersionNumbers } from "resources/codes/apiVersionNumbers";
import { httpCodes } from "resources/codes/responseStatusCodes";
import { BookFormat } from "resources/enum/BookFormat";
import sinon, { SinonSpy, SinonStub } from "sinon";
import { invalidEditionInputs, validEditionInputs } from "tests/testInputs";

describe("Edition addition integration tests", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusStub: SinonStub;
  let jsonSpy: SinonSpy;
  let setHeaderStub: SinonStub;
  let bookFindOneByStub: SinonStub;
  let editionSaveStub: SinonStub;
  let mockEdition: Edition;
  let mockBook: Book;
  let mockId: number;

  describe("Positive scenarios", () => {
    beforeEach(() => {
      // Reset stubs, spies, and mocks
      sinon.restore();

      // Stubs and spies
      bookFindOneByStub = sinon.stub(
        AppDataSource.getRepository(Book),
        "findOneBy"
      );
      editionSaveStub = sinon.stub(
        AppDataSource.getRepository(Edition),
        "save"
      );
      res = {
        setHeader: sinon.stub().callsFake(() => res) as unknown as SinonStub,
        status: sinon.stub().callsFake(() => res) as unknown as SinonStub,
        json: sinon.spy(),
      };

      // Mocks
      mockId = 1;

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

      // Mocks
      mockBook = new Book();
      mockEdition = new Edition();
      mockEdition.isbn = validEditionInputs.isbn;
      mockEdition.publicationDate = new Date(
        validEditionInputs.publication_date
      );
      mockEdition.publisher = validEditionInputs.publisher;
      mockEdition.pageCount = validEditionInputs.page_count;
      mockEdition.bookFormat = BookFormat.HARDCOVER;
      mockEdition.bookLanguage = validEditionInputs.book_language;
      mockEdition.book = mockBook;
    });

    it("created (201)", async () => {
      bookFindOneByStub.resolves(mockBook);
      editionSaveStub.resolves(mockEdition);

      await callEditionAddition(req as Request, res as Response);

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;
      setHeaderStub = res.setHeader as SinonStub;

      assert.strictEqual(
        setHeaderStub.calledWith(
          "x-api-version",
          apiVersionNumbers.VERSION_1_0
        ),
        true
      );
      assert.strictEqual(statusStub.calledWith(httpCodes.CREATED), true);
      assert.strictEqual(
        jsonSpy.calledWith({
          message: editionControllerResponseMessages.EDITION_ADDED,
          data: mockEdition,
        }),
        true
      );
    });
  });

  describe("Negative scenarios", () => {
    beforeEach(() => {
      // Reset stubs, spies, and mocks
      sinon.restore();

      // Stubs and spies
      bookFindOneByStub = sinon.stub(
        AppDataSource.getRepository(Book),
        "findOneBy"
      );
      editionSaveStub = sinon.stub(
        AppDataSource.getRepository(Edition),
        "save"
      );
      res = {
        status: sinon.stub().callsFake(() => res) as unknown as SinonStub,
        json: sinon.spy(),
      };

      // Mocks
      mockId = 1;
      mockBook = new Book();
      mockBook.id = mockId;

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

    it("validation error (500)", async () => {
      bookFindOneByStub.resolves(mockBook);

      req.body.isbn = invalidEditionInputs.INVALID_ISBN;

      await callEditionAddition(req as Request, res as Response);

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(statusStub.calledWith(httpCodes.BAD_REQUEST), true);
      assert.strictEqual(
        jsonSpy.calledWith({
          isIsbn: editionFailedValidation.ISBN_INVALID_MESSAGE,
        }),
        true
      );
    });

    it("server error (500) -> findOneBy (book) rejects", async () => {
      bookFindOneByStub.rejects();

      await callEditionAddition(req as Request, res as Response);

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(
        statusStub.calledWith(httpCodes.INTERNAL_SERVER_ERROR),
        true
      );
      assert.strictEqual(
        jsonSpy.calledWith({
          message: commonResponseMessages.SERVER_ERROR_MESSAGE,
        }),
        true
      );
    });

    it("server error (500) -> save (edition) rejects", async () => {
      bookFindOneByStub.resolves(mockBook);
      editionSaveStub.rejects();

      await callEditionAddition(req as Request, res as Response);

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(
        statusStub.calledWith(httpCodes.INTERNAL_SERVER_ERROR),
        true
      );
      assert.strictEqual(
        jsonSpy.calledWith({
          message: commonResponseMessages.SERVER_ERROR_MESSAGE,
        }),
        true
      );
    });

    it("not found (404) -> findOneBy (book) returns null", async () => {
      bookFindOneByStub.resolves(null);

      await callEditionAddition(req as Request, res as Response);

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(statusStub.calledWith(httpCodes.NOT_FOUND), true);
      assert.strictEqual(
        jsonSpy.calledWith({
          message: bookControllerResponseMessages.BOOK_NOT_FOUND,
        }),
        true
      );
    });
  });
});
