import assert from "assert";
import { AppDataSource } from "config/dataSource";
import { callBookAddition } from "controllers/bookController";
import { Book } from "entities/Book";
import { Request, Response } from "express";
import { bookControllerResponseMessages } from "messages/response/bookControllerResponseMessages";
import { commonResponseMessages } from "messages/response/commonResponseMessages";
import { bookFailedValidation } from "messages/validation/bookValidationMessages";
import { apiVersionNumbers } from "resources/codes/apiVersionNumbers";
import { httpCodes } from "resources/codes/responseStatusCodes";
import { Genre } from "resources/enum/Genre";
import sinon, { SinonSpy, SinonStub } from "sinon";
import { invalidBookInputs, validBookInputs } from "tests/testInputs";

describe("Book addition integration tests", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusStub: SinonStub;
  let jsonSpy: SinonSpy;
  let setHeaderStub: SinonStub;
  let mockBook: Book;
  let savedStub: SinonStub;

  describe("Positive scenarios", () => {
    beforeEach(() => {
      // Reset stubs and mocks
      sinon.restore();

      // Stubs
      savedStub = sinon.stub(AppDataSource.getRepository(Book), "save");

      res = {
        setHeader: sinon.stub().callsFake(() => res) as unknown as SinonStub,
        status: sinon.stub().callsFake(() => res) as unknown as SinonStub,
        json: sinon.spy(),
      };

      // Mocks
      mockBook = new Book();
      mockBook.title = validBookInputs.title;
      mockBook.genre = Genre.FICTION;
    });

    it("created (201)", async () => {
      savedStub.resolves(mockBook);

      req = {
        body: {
          title: validBookInputs.title,
          genre: validBookInputs.genre,
        },
      };

      await callBookAddition(req as Request, res as Response);

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;
      setHeaderStub = res.setHeader as SinonStub;

      assert.strictEqual(
        setHeaderStub.calledWith(
          "X-api-version",
          apiVersionNumbers.VERSION_1_0
        ),
        true
      );
      assert.strictEqual(statusStub.calledWith(httpCodes.CREATED), true);
      assert.strictEqual(
        jsonSpy.calledWith({
          message: bookControllerResponseMessages.BOOK_ADDED,
          data: mockBook,
        }),
        true
      );
    });
  });

  describe("Negative scenarios", () => {
    beforeEach(() => {
      // Reset stubs and mocks
      sinon.restore();

      // Stubs
      savedStub = sinon.stub(AppDataSource.getRepository(Book), "save");
      res = {
        status: sinon.stub().callsFake(() => res) as unknown as SinonStub,
        json: sinon.spy(),
      };

      req = {
        body: {
          title: validBookInputs.title,
          genre: validBookInputs.genre,
        },
      };
    });

    it("validation error (400)", async () => {
      req.body.title = invalidBookInputs.TITLE_TOO_LONG;

      await callBookAddition(req as Request, res as Response);

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(statusStub.calledWith(httpCodes.BAD_REQUEST), true);
      assert.strictEqual(
        jsonSpy.calledWith({
          maxLength: bookFailedValidation.TITLE_ABOVE_MAX_LENGTH_MESSAGE,
        }),
        true
      );
    });

    it("server error (500)", async () => {
      savedStub.rejects();

      await callBookAddition(req as Request, res as Response);

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
  });
});
