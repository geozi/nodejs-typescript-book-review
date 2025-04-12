import assert from "assert";
import { callBookAddition } from "controllers/bookController";
import { AppDataSource } from "db/dataSource";
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
      // Reset stubs and spies
      sinon.restore();

      // Stubs and spies
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

      // HTTP request
      req = {
        body: {
          title: validBookInputs.title,
          genre: validBookInputs.genre.toString(),
        },
      };
    });

    it("response code 201", async () => {
      savedStub.resolves(mockBook);

      await callBookAddition(req as Request, res as Response);

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
          message: bookControllerResponseMessages.BOOK_ADDED_MESSAGE,
          data: mockBook,
        }),
        true
      );
    });
  });

  describe("Negative scenarios", () => {
    beforeEach(() => {
      // Reset stubs and spies
      sinon.restore();

      // Stubs and spies
      savedStub = sinon.stub(AppDataSource.getRepository(Book), "save");
      res = {
        status: sinon.stub().callsFake(() => res) as unknown as SinonStub,
        json: sinon.spy(),
      };

      // HTTP request
      req = {
        body: {
          title: validBookInputs.title,
          genre: validBookInputs.genre.toString(),
        },
      };
    });

    it("response code 400", async () => {
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

    it("response code 500", async () => {
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
