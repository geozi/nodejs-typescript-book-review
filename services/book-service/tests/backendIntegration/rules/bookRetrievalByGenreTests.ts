import assert from "assert";
import { Request, Response } from "express";
import { bookFailedValidation } from "messages/validation/bookValidationMessages";
import { catchExpressValidationErrors } from "middleware/catchers/expressErrorCatcher";
import { bookRetrievalByGenreRules } from "middleware/rules/bookRules";
import { httpCodes } from "resources/codes/responseStatusCodes";
import sinon, { SinonSpy, SinonStub } from "sinon";
import { invalidBookInputs, validBookInputs } from "tests/testInputs";

describe("Book retrieval by genre integration tests", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: SinonSpy;
  let statusStub: SinonStub;
  let jsonSpy: SinonSpy;
  const bookRetrievalByGenreArray = [
    ...bookRetrievalByGenreRules(),
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

    it("request has valid genre", async () => {
      req = {
        body: JSON.parse(
          JSON.stringify({ genre: validBookInputs.genre.toString() })
        ),
      };

      for (const middleware of bookRetrievalByGenreArray) {
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
          JSON.stringify({ genre: validBookInputs.genre.toString() })
        ),
      };
    });

    it("genre is undefined", async () => {
      req.body.genre = undefined;

      for (const middleware of bookRetrievalByGenreArray) {
        await middleware(req as Request, res as Response, next);
      }

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(statusStub.calledWith(httpCodes.BAD_REQUEST), true);
      assert.strictEqual(
        jsonSpy.calledWith({
          errors: [{ message: bookFailedValidation.GENRE_REQUIRED_MESSAGE }],
        }),
        true
      );
    });

    it("genre is invalid", async () => {
      req.body.genre = invalidBookInputs.GENRE_INVALID;

      for (const middleware of bookRetrievalByGenreArray) {
        await middleware(req as Request, res as Response, next);
      }

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(statusStub.calledWith(httpCodes.BAD_REQUEST), true);
      assert.strictEqual(
        jsonSpy.calledWith({
          errors: [{ message: bookFailedValidation.GENRE_INVALID_MESSAGE }],
        }),
        true
      );
    });
  });
});
