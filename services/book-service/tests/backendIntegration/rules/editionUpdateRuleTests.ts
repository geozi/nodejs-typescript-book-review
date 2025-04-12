import assert from "assert";
import { Request, Response } from "express";
import { editionFailedValidation } from "messages/validation/editionValidationMessages";
import { catchExpressValidationErrors } from "middleware/catchers/expressErrorCatcher";
import { editionUpdateRules } from "middleware/rules/editionRules";
import { httpCodes } from "resources/codes/responseStatusCodes";
import sinon, { SinonSpy, SinonStub } from "sinon";
import {
  invalidCommonInputs,
  invalidEditionInputs,
  validEditionInputs,
} from "tests/testInputs";

describe("Edition update rules: integration tests", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: SinonSpy;
  let statusStub: SinonStub;
  let jsonSpy: SinonSpy;
  let mockId: number;
  const editionUpdateArray = [
    ...editionUpdateRules(),
    catchExpressValidationErrors,
  ];

  describe("Positive scenarios", () => {
    beforeEach(() => {
      // Reset stubs and spies
      sinon.restore();

      // Stubs and spies
      res = {
        status: sinon.stub().callsFake(() => {
          return res;
        }) as unknown as SinonStub,
        json: sinon.spy(),
      };
      next = sinon.spy();

      // Mocks
      mockId = 1;

      // HTTP request
      req = {
        body: JSON.parse(
          JSON.stringify({
            id: mockId,
            publicationDate: validEditionInputs.publication_date,
          })
        ),
      };
    });

    it("request has valid edition ID", async () => {
      for (const middleware of editionUpdateArray) {
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
      // Reset stubs and spies
      sinon.restore();

      // Stubs and spies
      res = {
        status: sinon.stub().callsFake(() => {
          return res;
        }) as unknown as SinonStub,
        json: sinon.spy(),
      };
      next = sinon.spy();

      // Mocks
      mockId = 1;

      // HTTP request
      req = {
        body: JSON.parse(
          JSON.stringify({
            id: mockId,
            publicationDate: validEditionInputs.publication_date,
          })
        ),
      };
    });

    it("id is undefined", async () => {
      req.body.id = undefined;

      for (const middleware of editionUpdateArray) {
        await middleware(req as Request, res as Response, next);
      }

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(statusStub.calledWith(httpCodes.BAD_REQUEST), true);
      assert.strictEqual(
        jsonSpy.calledWith({
          errors: [
            { message: editionFailedValidation.EDITION_ID_REQUIRED_MESSAGE },
          ],
        }),
        true
      );
    });

    it("id is invalid", async () => {
      req.body.id = invalidEditionInputs.INVALID_EDITION_ID;

      for (const middleware of editionUpdateArray) {
        await middleware(req as Request, res as Response, next);
      }

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(statusStub.calledWith(httpCodes.BAD_REQUEST), true);
      assert.strictEqual(
        jsonSpy.calledWith({
          errors: [
            { message: editionFailedValidation.EDITION_ID_INVALID_MESSAGE },
          ],
        }),
        true
      );
    });

    it("id is negative", async () => {
      req.body.id = invalidCommonInputs.NEGATIVE_ID;

      for (const middleware of editionUpdateArray) {
        await middleware(req as Request, res as Response, next);
      }

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(statusStub.calledWith(httpCodes.BAD_REQUEST), true);
      assert.strictEqual(
        jsonSpy.calledWith({
          errors: [
            { message: editionFailedValidation.EDITION_ID_NEGATIVE_MESSAGE },
          ],
        }),
        true
      );
    });

    it("publicationDate is invalid", async () => {
      req.body.publicationDate = invalidEditionInputs.INVALID_DATE;

      for (const middleware of editionUpdateArray) {
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
  });
});
