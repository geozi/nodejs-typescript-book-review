import assert from "assert";
import { Request, Response } from "express";
import { commonResponseMessages } from "messages/response/commonResponseMessages";
import { addressFailedValidation } from "messages/validation/addressValidationMessages";
import { personFailedValidation } from "messages/validation/personValidationMessages";
import { catchExpressValidationErrors } from "middleware/catchers/expressErrorCatcher";
import { personInfoUpdateRules } from "middleware/rules/personRules";
import { User } from "models/User";
import { httpCodes } from "resources/codes/responseStatusCodes";
import sinon, { SinonSpy, SinonStub } from "sinon";
import {
  invalidAddressInputs,
  invalidObjectIdInputs,
  invalidPersonInputs,
  validPersonInput,
  validUserInput,
} from "tests/testInputs";

describe("Person update rules: integration tests", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: SinonSpy;
  let statusStub: SinonStub;
  let jsonSpy: SinonSpy;
  const mockId = "67d6f5421100cfe33701b06e";
  const mockUser = new User(validUserInput);
  const updateRulesArray = [
    ...personInfoUpdateRules(),
    catchExpressValidationErrors,
  ];

  describe("Positive scenario", () => {
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

      // HTTP request
      req = {
        body: JSON.parse(
          JSON.stringify({
            id: mockId,
            firstName: validPersonInput.firstName,
            lastName: validPersonInput.lastName,
            ssn: validPersonInput.ssn,
            phoneNumber: validPersonInput.phoneNumber,
            address: validPersonInput.address,
          })
        ),
        user: mockUser,
      };
    });

    it("request has valid inputs", async () => {
      for (const middleware of updateRulesArray) {
        await middleware(req as Request, res as Response, next);
      }

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(statusStub.notCalled, true);
      assert.strictEqual(jsonSpy.notCalled, true);
    });
  });

  describe("Negative scenarios", () => {
    describe("bad requests (400)", () => {
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

        // HTTP request
        req = {
          body: JSON.parse(
            JSON.stringify({
              id: mockId,
              firstName: validPersonInput.firstName,
              lastName: validPersonInput.lastName,
              ssn: validPersonInput.ssn,
              phoneNumber: validPersonInput.phoneNumber,
              address: validPersonInput.address,
            })
          ),
          user: mockUser,
        };
      });

      it("id is undefined", async () => {
        req.body.id = undefined;

        for (const middleware of updateRulesArray) {
          await middleware(req as Request, res as Response, next);
        }

        statusStub = res.status as SinonStub;
        jsonSpy = res.json as SinonSpy;

        assert.strictEqual(statusStub.calledWith(httpCodes.BAD_REQUEST), true);
        assert.strictEqual(
          jsonSpy.calledWith({
            message: commonResponseMessages.BAD_REQUEST_MESSAGE,
            errors: [
              { message: personFailedValidation.PERSON_ID_REQUIRED_MESSAGE },
            ],
          }),
          true
        );
      });

      invalidObjectIdInputs.OBJECT_ID_LENGTH_CASES.forEach(
        ([testName, invalidLengthId]) => [
          it(testName, async () => {
            req.body.id = invalidLengthId;

            for (const middleware of updateRulesArray) {
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
                    message:
                      personFailedValidation.PERSON_ID_OUT_OF_LENGTH_MESSAGE,
                  },
                ],
              }),
              true
            );
          }),
        ]
      );

      invalidObjectIdInputs.OBJECT_ID_INVALID_CASES.forEach(
        ([testName, invalidId]) => {
          it(testName, async () => {
            req.body.id = invalidId;

            for (const middleware of updateRulesArray) {
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
                  { message: personFailedValidation.PERSON_ID_INVALID_MESSAGE },
                ],
              }),
              true
            );
          });
        }
      );

      it("firstName is too short", async () => {
        req.body.firstName = invalidPersonInputs.TOO_SHORT_FIRST_NAME;

        for (const middleware of updateRulesArray) {
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

        for (const middleware of updateRulesArray) {
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

      it("lastName is too short", async () => {
        req.body.lastName = invalidPersonInputs.TOO_SHORT_LAST_NAME;

        for (const middleware of updateRulesArray) {
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

        for (const middleware of updateRulesArray) {
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

      invalidPersonInputs.INVALID_SSN_CASES.forEach(
        ([testName, invalidSsn]) => {
          it(testName, async () => {
            req.body.ssn = invalidSsn;

            for (const middleware of updateRulesArray) {
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
                    message: personFailedValidation.SSN_INVALID_MESSAGE,
                  },
                ],
              }),
              true
            );
          });
        }
      );

      invalidPersonInputs.INVALID_PHONE_NUMBER_CASES.forEach(
        ([testName, invalidPhoneNumber]) => {
          it(testName, async () => {
            req.body.phoneNumber = invalidPhoneNumber;

            for (const middleware of updateRulesArray) {
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
                    message:
                      personFailedValidation.PHONE_NUMBER_INVALID_MESSAGE,
                  },
                ],
              }),
              true
            );
          });
        }
      );

      it("address.streetName is too short", async () => {
        req.body.address.streetName =
          invalidAddressInputs.TOO_SHORT_STREET_NAME;

        for (const middleware of updateRulesArray) {
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

      it("address.residenceNumber is invalid", async () => {
        req.body.address.residenceNumber =
          invalidAddressInputs.INVALID_RESIDENCE_NUMBER;

        for (const middleware of updateRulesArray) {
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
                  addressFailedValidation.RESIDENCE_NUMBER_INVALID_MESSAGE,
              },
            ],
          }),
          true
        );
      });

      it("address.residenceNumber is negative", async () => {
        req.body.address.residenceNumber =
          invalidAddressInputs.NEGATIVE_RESIDENCE_NUMBER;

        for (const middleware of updateRulesArray) {
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

        for (const middleware of updateRulesArray) {
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

        for (const middleware of updateRulesArray) {
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

      it("address.city is invalid", async () => {
        req.body.address.city = invalidAddressInputs.INVALID_CITY;

        for (const middleware of updateRulesArray) {
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
});
