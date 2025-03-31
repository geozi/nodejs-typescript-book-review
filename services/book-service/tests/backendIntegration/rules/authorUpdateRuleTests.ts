import assert from "assert";
import { Request, Response } from "express";
import { authorFailedValidation } from "messages/validation/authorValidationMessages";
import { catchExpressValidationErrors } from "middleware/catchers/expressErrorCatcher";
import { authorUpdateRules } from "middleware/rules/authorRules";
import { httpCodes } from "resources/codes/responseStatusCodes";
import sinon, { SinonSpy, SinonStub } from "sinon";
import { invalidAuthorInputs, validAuthorInputs } from "tests/testInputs";

describe.only("Author update rules integration tests", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: SinonSpy;
  let statusStub: SinonStub;
  let jsonSpy: SinonSpy;
  const authorUpdateArray = [
    ...authorUpdateRules(),
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
          JSON.stringify({ id: "1", firstName: validAuthorInputs.firstName })
        ),
      };

      for (const middleware of authorUpdateArray) {
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
          JSON.stringify({ id: "1", firstName: validAuthorInputs.firstName })
        ),
      };
    });

    it("author ID is undefined", async () => {
      req.body.id = undefined;

      for (const middleware of authorUpdateArray) {
        await middleware(req as Request, res as Response, next);
      }

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(statusStub.calledWith(httpCodes.BAD_REQUEST), true);
      assert.strictEqual(
        jsonSpy.calledWith({
          errors: [
            { message: authorFailedValidation.AUTHOR_ID_REQUIRED_MESSAGE },
          ],
        }),
        true
      );
    });

    it("author ID is invalid", async () => {
      req.body.id = invalidAuthorInputs.INVALID_AUTHOR_ID;

      for (const middleware of authorUpdateArray) {
        await middleware(req as Request, res as Response, next);
      }

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(statusStub.calledWith(httpCodes.BAD_REQUEST), true);
      assert.strictEqual(
        jsonSpy.calledWith({
          errors: [{ message: authorFailedValidation.AUTHOR_ID_INVALID }],
        }),
        true
      );
    });

    it("firstName is too short", async () => {
      req.body.firstName = invalidAuthorInputs.NAME_TOO_SHORT;

      for (const middleware of authorUpdateArray) {
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
                authorFailedValidation.FIRST_NAME_BELOW_MIN_LENGTH_MESSAGE,
            },
          ],
        }),
        true
      );
    });

    it("firstName is invalid", async () => {
      req.body.firstName = invalidAuthorInputs.NAME_INVALID;

      for (const middleware of authorUpdateArray) {
        await middleware(req as Request, res as Response, next);
      }

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(statusStub.calledWith(httpCodes.BAD_REQUEST), true);
      assert.strictEqual(
        jsonSpy.calledWith({
          errors: [
            { message: authorFailedValidation.FIRST_NAME_INVALID_MESSAGE },
          ],
        }),
        true
      );
    });
  });
});
