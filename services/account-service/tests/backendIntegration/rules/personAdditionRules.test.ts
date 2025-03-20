import { catchExpressValidationErrors } from "middleware/expressError.catch";
import { personInfoAdditionRules } from "middleware/person.rule";
import sinon, { SinonSpy, SinonStub } from "sinon";
import { Request, Response } from "express";
import {
  invalidAddressInputs,
  invalidPersonInputs,
  validPersonInput,
} from "../../testInputs";
import assert from "assert";
import { httpCodes } from "resources/codes/responseStatusCodes";
import { commonResponseMessages } from "messages/response/commonResponse.message";
import { personFailedValidation } from "messages/validation/personValidation.message";
import { addressFailedValidation } from "messages/validation/addressValidation.message";

describe("Personal info addition rules integration tests", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: SinonSpy;
  let statusStub: SinonStub;
  let jsonSpy: SinonSpy;
  const infoAdditionArray = [
    ...personInfoAdditionRules(),
    catchExpressValidationErrors,
  ];

  describe("Positive scenarios", () => {
    beforeEach(() => {
      sinon.restore();
      res = {
        status: sinon.stub().callsFake(() => {
          return res;
        }) as unknown as SinonStub,
        json: sinon.spy(),
      };

      next = sinon.spy();
      req = { body: JSON.parse(JSON.stringify(validPersonInput)) };
    });

    it("request has valid inputs", async () => {
      for (const middleware of infoAdditionArray) {
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
      sinon.restore();
      res = {
        status: sinon.stub().callsFake(() => {
          return res;
        }) as unknown as SinonStub,
        json: sinon.spy(),
      };

      next = sinon.spy();
      req = { body: JSON.parse(JSON.stringify(validPersonInput)) };
    });

    it("firstName is undefined", async () => {
      req.body.firstName = undefined;

      for (const middleware of infoAdditionArray) {
        await middleware(req as Request, res as Response, next);
      }

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(statusStub.calledWith(httpCodes.BAD_REQUEST), true);
      assert.strictEqual(
        jsonSpy.calledWith({
          message: commonResponseMessages.BAD_REQUEST_MESSAGE,
          errors: [
            { message: personFailedValidation.FIRST_NAME_REQUIRED_MESSAGE },
          ],
        }),
        true
      );
    });

    it("firstName is too short", async () => {
      req.body.firstName = invalidPersonInputs.TOO_SHORT_FIRST_NAME;

      for (const middleware of infoAdditionArray) {
        await middleware(req as Request, res as Response, next);
      }

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(statusStub.calledWith(httpCodes.BAD_REQUEST), true);
      assert.strictEqual(
        jsonSpy.calledWith({
          message: commonResponseMessages.BAD_REQUEST_MESSAGE,
          errors: [
            {
              message:
                personFailedValidation.FIRST_NAME_BELOW_MIN_LENGTH_MESSAGE,
            },
          ],
        }),
        true
      );
    });

    it("firstName is invalid", async () => {
      req.body.firstName = invalidPersonInputs.INVALID_FIRST_NAME;

      for (const middleware of infoAdditionArray) {
        await middleware(req as Request, res as Response, next);
      }

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(statusStub.calledWith(httpCodes.BAD_REQUEST), true);
      assert.strictEqual(
        jsonSpy.calledWith({
          message: commonResponseMessages.BAD_REQUEST_MESSAGE,
          errors: [
            {
              message: personFailedValidation.FIRST_NAME_INVALID_MESSAGE,
            },
          ],
        }),
        true
      );
    });

    it("lastName is undefined", async () => {
      req.body.lastName = undefined;

      for (const middleware of infoAdditionArray) {
        await middleware(req as Request, res as Response, next);
      }

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(statusStub.calledWith(httpCodes.BAD_REQUEST), true);
      assert.strictEqual(
        jsonSpy.calledWith({
          message: commonResponseMessages.BAD_REQUEST_MESSAGE,
          errors: [
            {
              message: personFailedValidation.LAST_NAME_REQUIRED_MESSAGE,
            },
          ],
        }),
        true
      );
    });

    it("lastName is too short", async () => {
      req.body.lastName = invalidPersonInputs.TOO_SHORT_LAST_NAME;

      for (const middleware of infoAdditionArray) {
        await middleware(req as Request, res as Response, next);
      }

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(statusStub.calledWith(httpCodes.BAD_REQUEST), true);
      assert.strictEqual(
        jsonSpy.calledWith({
          message: commonResponseMessages.BAD_REQUEST_MESSAGE,
          errors: [
            {
              message:
                personFailedValidation.LAST_NAME_BELOW_MIN_LENGTH_MESSAGE,
            },
          ],
        }),
        true
      );
    });

    it("lastName is invalid", async () => {
      req.body.lastName = invalidPersonInputs.INVALID_LAST_NAME;

      for (const middleware of infoAdditionArray) {
        await middleware(req as Request, res as Response, next);
      }

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(statusStub.calledWith(httpCodes.BAD_REQUEST), true);
      assert.strictEqual(
        jsonSpy.calledWith({
          message: commonResponseMessages.BAD_REQUEST_MESSAGE,
          errors: [
            {
              message: personFailedValidation.LAST_NAME_INVALID_MESSAGE,
            },
          ],
        }),
        true
      );
    });

    it("ssn is undefined", async () => {
      req.body.ssn = undefined;

      for (const middleware of infoAdditionArray) {
        await middleware(req as Request, res as Response, next);
      }

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(statusStub.calledWith(httpCodes.BAD_REQUEST), true);
      assert.strictEqual(
        jsonSpy.calledWith({
          message: commonResponseMessages.BAD_REQUEST_MESSAGE,
          errors: [
            {
              message: personFailedValidation.SSN_REQUIRED_MESSAGE,
            },
          ],
        }),
        true
      );
    });

    invalidPersonInputs.INVALID_SSN_CASES.forEach(([testName, invalidSsn]) => {
      it(testName, async () => {
        req.body.ssn = invalidSsn;

        for (const middleware of infoAdditionArray) {
          await middleware(req as Request, res as Response, next);
        }

        statusStub = res.status as SinonStub;
        jsonSpy = res.json as SinonSpy;

        assert.strictEqual(statusStub.calledWith(httpCodes.BAD_REQUEST), true);
        assert.strictEqual(
          jsonSpy.calledWith({
            message: commonResponseMessages.BAD_REQUEST_MESSAGE,
            errors: [
              {
                message: personFailedValidation.SSN_INVALID_MESSAGE,
              },
            ],
          }),
          true
        );
      });
    });

    it("phoneNumber is undefined", async () => {
      req.body.phoneNumber = undefined;

      for (const middleware of infoAdditionArray) {
        await middleware(req as Request, res as Response, next);
      }

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(statusStub.calledWith(httpCodes.BAD_REQUEST), true);
      assert.strictEqual(
        jsonSpy.calledWith({
          message: commonResponseMessages.BAD_REQUEST_MESSAGE,
          errors: [
            {
              message: personFailedValidation.PHONE_NUMBER_REQUIRED_MESSAGE,
            },
          ],
        }),
        true
      );
    });

    invalidPersonInputs.INVALID_PHONE_NUMBER_CASES.forEach(
      ([testName, invalidPhoneNumber]) => {
        it(testName, async () => {
          req.body.phoneNumber = invalidPhoneNumber;

          for (const middleware of infoAdditionArray) {
            await middleware(req as Request, res as Response, next);
          }

          statusStub = res.status as SinonStub;
          jsonSpy = res.json as SinonSpy;

          assert.strictEqual(
            statusStub.calledWith(httpCodes.BAD_REQUEST),
            true
          );
          assert.strictEqual(
            jsonSpy.calledWith({
              message: commonResponseMessages.BAD_REQUEST_MESSAGE,
              errors: [
                {
                  message: personFailedValidation.PHONE_NUMBER_INVALID_MESSAGE,
                },
              ],
            }),
            true
          );
        });
      }
    );

    it("address is undefined", async () => {
      req.body.address = undefined;

      for (const middleware of infoAdditionArray) {
        await middleware(req as Request, res as Response, next);
      }

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(statusStub.calledWith(httpCodes.BAD_REQUEST), true);
      assert.strictEqual(
        jsonSpy.calledWith({
          message: commonResponseMessages.BAD_REQUEST_MESSAGE,
          errors: [
            {
              message: personFailedValidation.ADDRESS_REQUIRED_MESSAGE,
            },
          ],
        }),
        true
      );
    });

    it("address.streetName is undefined", async () => {
      req.body.address.streetName = undefined;

      for (const middleware of infoAdditionArray) {
        await middleware(req as Request, res as Response, next);
      }

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(statusStub.calledWith(httpCodes.BAD_REQUEST), true);
      assert.strictEqual(
        jsonSpy.calledWith({
          message: commonResponseMessages.BAD_REQUEST_MESSAGE,
          errors: [
            {
              message: addressFailedValidation.STREET_NAME_REQUIRED_MESSAGE,
            },
          ],
        }),
        true
      );
    });

    it("address.streetName is too short", async () => {
      req.body.address.streetName = invalidAddressInputs.TOO_SHORT_STREET_NAME;

      for (const middleware of infoAdditionArray) {
        await middleware(req as Request, res as Response, next);
      }

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(statusStub.calledWith(httpCodes.BAD_REQUEST), true);
      assert.strictEqual(
        jsonSpy.calledWith({
          message: commonResponseMessages.BAD_REQUEST_MESSAGE,
          errors: [
            {
              message:
                addressFailedValidation.STREET_NAME_BELOW_MIN_LENGTH_MESSAGE,
            },
          ],
        }),
        true
      );
    });

    it("address.residenceNumber is undefined", async () => {
      req.body.address.residenceNumber = undefined;

      for (const middleware of infoAdditionArray) {
        await middleware(req as Request, res as Response, next);
      }

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(statusStub.calledWith(httpCodes.BAD_REQUEST), true);
      assert.strictEqual(
        jsonSpy.calledWith({
          message: commonResponseMessages.BAD_REQUEST_MESSAGE,
          errors: [
            {
              message:
                addressFailedValidation.RESIDENCE_NUMBER_REQUIRED_MESSAGE,
            },
          ],
        }),
        true
      );
    });

    it("address.residenceNumber is invalid", async () => {
      req.body.address.residenceNumber =
        invalidAddressInputs.INVALID_RESIDENCE_NUMBER;

      for (const middleware of infoAdditionArray) {
        await middleware(req as Request, res as Response, next);
      }

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(statusStub.calledWith(httpCodes.BAD_REQUEST), true);
      assert.strictEqual(
        jsonSpy.calledWith({
          message: commonResponseMessages.BAD_REQUEST_MESSAGE,
          errors: [
            {
              message: addressFailedValidation.RESIDENCE_NUMBER_INVALID_MESSAGE,
            },
          ],
        }),
        true
      );
    });

    it("address.residenceNumber is negative", async () => {
      req.body.address.residenceNumber =
        invalidAddressInputs.NEGATIVE_RESIDENCE_NUMBER;

      for (const middleware of infoAdditionArray) {
        await middleware(req as Request, res as Response, next);
      }

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(statusStub.calledWith(httpCodes.BAD_REQUEST), true);
      assert.strictEqual(
        jsonSpy.calledWith({
          message: commonResponseMessages.BAD_REQUEST_MESSAGE,
          errors: [
            {
              message:
                addressFailedValidation.RESIDENCE_NUMBER_NEGATIVE_MESSAGE,
            },
          ],
        }),
        true
      );
    });

    it("address.zipCode is out of length", async () => {
      req.body.address.zipCode = invalidAddressInputs.ZIP_CODE_OUT_OF_LENGTH;

      for (const middleware of infoAdditionArray) {
        await middleware(req as Request, res as Response, next);
      }

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(statusStub.calledWith(httpCodes.BAD_REQUEST), true);
      assert.strictEqual(
        jsonSpy.calledWith({
          message: commonResponseMessages.BAD_REQUEST_MESSAGE,
          errors: [
            {
              message: addressFailedValidation.ZIP_CODE_OUT_OF_LENGTH_MESSAGE,
            },
          ],
        }),
        true
      );
    });

    it("address.zipCode is invalid", async () => {
      req.body.address.zipCode = invalidAddressInputs.INVALID_ZIP_CODE;

      for (const middleware of infoAdditionArray) {
        await middleware(req as Request, res as Response, next);
      }

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(statusStub.calledWith(httpCodes.BAD_REQUEST), true);
      assert.strictEqual(
        jsonSpy.calledWith({
          message: commonResponseMessages.BAD_REQUEST_MESSAGE,
          errors: [
            {
              message: addressFailedValidation.ZIP_CODE_INVALID_MESSAGE,
            },
          ],
        }),
        true
      );
    });

    it("address.city is undefined", async () => {
      req.body.address.city = undefined;

      for (const middleware of infoAdditionArray) {
        await middleware(req as Request, res as Response, next);
      }

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(statusStub.calledWith(httpCodes.BAD_REQUEST), true);
      assert.strictEqual(
        jsonSpy.calledWith({
          message: commonResponseMessages.BAD_REQUEST_MESSAGE,
          errors: [
            {
              message: addressFailedValidation.CITY_REQUIRED_MESSAGE,
            },
          ],
        }),
        true
      );
    });

    it("address.city is invalid", async () => {
      req.body.address.city = invalidAddressInputs.INVALID_CITY;

      for (const middleware of infoAdditionArray) {
        await middleware(req as Request, res as Response, next);
      }

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(statusStub.calledWith(httpCodes.BAD_REQUEST), true);
      assert.strictEqual(
        jsonSpy.calledWith({
          message: commonResponseMessages.BAD_REQUEST_MESSAGE,
          errors: [
            {
              message: addressFailedValidation.CITY_INVALID_MESSAGE,
            },
          ],
        }),
        true
      );
    });
  });
});
