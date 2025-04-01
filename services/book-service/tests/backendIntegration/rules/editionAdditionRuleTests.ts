import assert from "assert";
import { Request, Response } from "express";
import { editionFailedValidation } from "messages/validation/editionValidationMessages";
import { catchExpressValidationErrors } from "middleware/catchers/expressErrorCatcher";
import { editionAdditionRules } from "middleware/rules/editionRules";
import { httpCodes } from "resources/codes/responseStatusCodes";
import sinon, { SinonSpy, SinonStub } from "sinon";
import { invalidEditionInputs, validEditionInputs } from "tests/testInputs";

describe("Edition addition rules integration tests", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: SinonSpy;
  let statusStub: SinonStub;
  let jsonSpy: SinonSpy;
  const editionAdditionArray = [
    ...editionAdditionRules(),
    catchExpressValidationErrors,
  ];

  describe("Positive scenarios", () => {
    beforeEach(() => {
      // Reset stubs, mocks, and spies.
      sinon.restore();

      // Stubs and spies
      res = {
        status: sinon.stub().callsFake(() => {
          return res;
        }) as unknown as SinonStub,
        json: sinon.spy(),
      };
      next = sinon.spy();
    });

    it("request has valid inputs", async () => {
      req = {
        body: JSON.parse(
          JSON.stringify({
            isbn: validEditionInputs.isbn,
            publicationDate: validEditionInputs.publication_date,
            publisher: validEditionInputs.publisher,
            pageCount: validEditionInputs.page_count.toString(),
            bookFormat: validEditionInputs.book_format.toString(),
            bookLanguage: validEditionInputs.book_language,
          })
        ),
      };

      for (const middleware of editionAdditionArray) {
        await middleware(req as Request, res as Response, next);
      }

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(statusStub.notCalled, true);
      assert.strictEqual(jsonSpy.notCalled, true);
    });
  });

  describe("Negative scenarios", () => {
    beforeEach(() => {
      // Reset stubs, mocks, and spies.
      sinon.restore();

      // Stubs and spies
      res = {
        status: sinon.stub().callsFake(() => {
          return res;
        }) as unknown as SinonStub,
        json: sinon.spy(),
      };
      next = sinon.spy();

      req = {
        body: JSON.parse(
          JSON.stringify({
            isbn: validEditionInputs.isbn,
            publicationDate: validEditionInputs.publication_date,
            publisher: validEditionInputs.publisher,
            pageCount: validEditionInputs.page_count.toString(),
            bookFormat: validEditionInputs.book_format.toString(),
            bookLanguage: validEditionInputs.book_language,
          })
        ),
      };
    });

    it("isbn is undefined", async () => {
      req.body.isbn = undefined;

      for (const middleware of editionAdditionArray) {
        await middleware(req as Request, res as Response, next);
      }

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(statusStub.calledWith(httpCodes.BAD_REQUEST), true);
      assert.strictEqual(
        jsonSpy.calledWith({
          errors: [{ message: editionFailedValidation.ISBN_REQUIRED_MESSAGE }],
        }),
        true
      );
    });

    it("isbn is invalid", async () => {
      req.body.isbn = invalidEditionInputs.INVALID_ISBN;

      for (const middleware of editionAdditionArray) {
        await middleware(req as Request, res as Response, next);
      }

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(statusStub.calledWith(httpCodes.BAD_REQUEST), true);
      assert.strictEqual(
        jsonSpy.calledWith({
          errors: [{ message: editionFailedValidation.ISBN_INVALID_MESSAGE }],
        }),
        true
      );
    });

    it("publicationDate is undefined", async () => {
      req.body.publicationDate = undefined;

      for (const middleware of editionAdditionArray) {
        await middleware(req as Request, res as Response, next);
      }

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(statusStub.calledWith(httpCodes.BAD_REQUEST), true);
      assert.strictEqual(
        jsonSpy.calledWith({
          errors: [
            {
              message:
                editionFailedValidation.PUBLICATION_DATE_REQUIRED_MESSAGE,
            },
          ],
        }),
        true
      );
    });

    it("publicationDate is invalid", async () => {
      req.body.publicationDate = invalidEditionInputs.INVALID_DATE;

      for (const middleware of editionAdditionArray) {
        await middleware(req as Request, res as Response, next);
      }

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(statusStub.calledWith(httpCodes.BAD_REQUEST), true);
      assert.strictEqual(
        jsonSpy.calledWith({
          errors: [
            {
              message: editionFailedValidation.PUBLICATION_DATE_INVALID_MESSAGE,
            },
          ],
        }),
        true
      );
    });

    it("publisher name is undefined", async () => {
      req.body.publisher = undefined;

      for (const middleware of editionAdditionArray) {
        await middleware(req as Request, res as Response, next);
      }

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(statusStub.calledWith(httpCodes.BAD_REQUEST), true);
      assert.strictEqual(
        jsonSpy.calledWith({
          errors: [
            {
              message: editionFailedValidation.PUBLISHER_REQUIRED_MESSAGE,
            },
          ],
        }),
        true
      );
    });

    it("publisher name is too short", async () => {
      req.body.publisher = invalidEditionInputs.PUBLISHER_NAME_TOO_SHORT;

      for (const middleware of editionAdditionArray) {
        await middleware(req as Request, res as Response, next);
      }

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(statusStub.calledWith(httpCodes.BAD_REQUEST), true);
      assert.strictEqual(
        jsonSpy.calledWith({
          errors: [
            {
              message:
                editionFailedValidation.PUBLISHER_BELOW_MIN_LENGTH_MESSAGE,
            },
          ],
        }),
        true
      );
    });

    it("publisher name is too long", async () => {
      req.body.publisher = invalidEditionInputs.PUBLISHER_NAME_TOO_LONG;

      for (const middleware of editionAdditionArray) {
        await middleware(req as Request, res as Response, next);
      }

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(statusStub.calledWith(httpCodes.BAD_REQUEST), true);
      assert.strictEqual(
        jsonSpy.calledWith({
          errors: [
            {
              message:
                editionFailedValidation.PUBLISHER_ABOVE_MAX_LENGTH_MESSAGE,
            },
          ],
        }),
        true
      );
    });

    it("pageCount is undefined", async () => {
      req.body.pageCount = undefined;

      for (const middleware of editionAdditionArray) {
        await middleware(req as Request, res as Response, next);
      }

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(statusStub.calledWith(httpCodes.BAD_REQUEST), true);
      assert.strictEqual(
        jsonSpy.calledWith({
          errors: [
            {
              message: editionFailedValidation.PAGE_COUNT_REQUIRED_MESSAGE,
            },
          ],
        }),
        true
      );
    });

    it("pageCount is negative", async () => {
      req.body.pageCount = invalidEditionInputs.PAGE_COUNT_NEGATIVE;

      for (const middleware of editionAdditionArray) {
        await middleware(req as Request, res as Response, next);
      }

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(statusStub.calledWith(httpCodes.BAD_REQUEST), true);
      assert.strictEqual(
        jsonSpy.calledWith({
          errors: [
            {
              message: editionFailedValidation.PAGE_COUNT_NEGATIVE_MESSAGE,
            },
          ],
        }),
        true
      );
    });

    it("pageCount is too low", async () => {
      req.body.pageCount = invalidEditionInputs.PAGE_COUNT_MIN;

      for (const middleware of editionAdditionArray) {
        await middleware(req as Request, res as Response, next);
      }

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(statusStub.calledWith(httpCodes.BAD_REQUEST), true);
      assert.strictEqual(
        jsonSpy.calledWith({
          errors: [
            {
              message: editionFailedValidation.PAGE_COUNT_MINIMUM_MESSAGE,
            },
          ],
        }),
        true
      );
    });

    it("bookFormat is undefined", async () => {
      req.body.bookFormat = undefined;

      for (const middleware of editionAdditionArray) {
        await middleware(req as Request, res as Response, next);
      }

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(statusStub.calledWith(httpCodes.BAD_REQUEST), true);
      assert.strictEqual(
        jsonSpy.calledWith({
          errors: [
            {
              message: editionFailedValidation.BOOK_FORMAT_REQUIRED_MESSAGE,
            },
          ],
        }),
        true
      );
    });

    it("bookFormat is invalid", async () => {
      req.body.bookFormat = invalidEditionInputs.INVALID_BOOK_FORMAT;

      for (const middleware of editionAdditionArray) {
        await middleware(req as Request, res as Response, next);
      }

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(statusStub.calledWith(httpCodes.BAD_REQUEST), true);
      assert.strictEqual(
        jsonSpy.calledWith({
          errors: [
            {
              message: editionFailedValidation.BOOK_FORMAT_INVALID_MESSAGE,
            },
          ],
        }),
        true
      );
    });

    it("bookLanguage is undefined", async () => {
      req.body.bookLanguage = undefined;

      for (const middleware of editionAdditionArray) {
        await middleware(req as Request, res as Response, next);
      }

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(statusStub.calledWith(httpCodes.BAD_REQUEST), true);
      assert.strictEqual(
        jsonSpy.calledWith({
          errors: [
            {
              message: editionFailedValidation.LANGUAGE_REQUIRED_MESSAGE,
            },
          ],
        }),
        true
      );
    });

    it("bookLanguage is invalid", async () => {
      req.body.bookLanguage = invalidEditionInputs.INVALID_LANGUAGE;

      for (const middleware of editionAdditionArray) {
        await middleware(req as Request, res as Response, next);
      }

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(statusStub.calledWith(httpCodes.BAD_REQUEST), true);
      assert.strictEqual(
        jsonSpy.calledWith({
          errors: [
            {
              message: editionFailedValidation.LANGUAGE_INVALID_MESSAGE,
            },
          ],
        }),
        true
      );
    });

    it("bookLanguage is too short", async () => {
      req.body.bookLanguage = invalidEditionInputs.LANGUAGE_TOO_SHORT;

      for (const middleware of editionAdditionArray) {
        await middleware(req as Request, res as Response, next);
      }

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(statusStub.calledWith(httpCodes.BAD_REQUEST), true);
      assert.strictEqual(
        jsonSpy.calledWith({
          errors: [
            {
              message: editionFailedValidation.LANGUAGE_MIN_LENGTH_MESSAGE,
            },
          ],
        }),
        true
      );
    });
  });
});
