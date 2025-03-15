import { Request, Response } from "express";
import sinon, { SinonSpy, SinonStub } from "sinon";
import { invalidUserInputs, validUserInput } from "../testInputs";
import { userRegistrationRules } from "middleware/user.rule";
import { catchExpressValidationErrors } from "middleware/expressError.catch";
import assert from "assert";
import { httpCodes } from "resources/codes/responseStatusCodes";
import { commonResponseMessages } from "messages/response/commonResponse.message";
import { userFailedValidation } from "messages/validation/userValidation.message";

describe("User registration integration tests", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: SinonSpy;
  let statusStub: SinonStub;
  let jsonSpy: SinonSpy;
  const registrationRulesArray = [
    ...userRegistrationRules(),
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
      req = { body: JSON.parse(JSON.stringify(validUserInput)) };
    });

    it("request has valid inputs", async () => {
      for (const middleware of registrationRulesArray) {
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
        sinon.restore();

        res = {
          status: sinon.stub().callsFake(() => {
            return res;
          }) as unknown as SinonStub,
          json: sinon.spy(),
        };

        next = sinon.spy();
        req = { body: JSON.parse(JSON.stringify(validUserInput)) };
      });

      it("username is undefined", async () => {
        req.body.username = undefined;

        for (const middleware of registrationRulesArray) {
          await middleware(req as Request, res as Response, next);
        }

        statusStub = res.status as SinonStub;
        jsonSpy = res.json as SinonSpy;

        assert.strictEqual(statusStub.calledWith(httpCodes.BAD_REQUEST), true);
        assert.strictEqual(
          jsonSpy.calledWith({
            message: commonResponseMessages.BAD_REQUEST,
            errors: [
              { message: userFailedValidation.USERNAME_REQUIRED_MESSAGE },
            ],
          }),
          true
        );
      });

      it("username is too short", async () => {
        req.body.username = invalidUserInputs.TOO_SHORT_USERNAME;

        for (const middleware of registrationRulesArray) {
          await middleware(req as Request, res as Response, next);
        }

        statusStub = res.status as SinonStub;
        jsonSpy = res.json as SinonSpy;

        assert.strictEqual(statusStub.calledWith(httpCodes.BAD_REQUEST), true);
        assert.strictEqual(
          jsonSpy.calledWith({
            message: commonResponseMessages.BAD_REQUEST,
            errors: [
              {
                message: userFailedValidation.USERNAME_BELOW_MIN_LENGTH_MESSAGE,
              },
            ],
          }),
          true
        );
      });

      it("username is too long", async () => {
        req.body.username = invalidUserInputs.TOO_LONG_USERNAME;

        for (const middleware of registrationRulesArray) {
          await middleware(req as Request, res as Response, next);
        }

        statusStub = res.status as SinonStub;
        jsonSpy = res.json as SinonSpy;

        assert.strictEqual(statusStub.calledWith(httpCodes.BAD_REQUEST), true);
        assert.strictEqual(
          jsonSpy.calledWith({
            message: commonResponseMessages.BAD_REQUEST,
            errors: [
              {
                message: userFailedValidation.USERNAME_ABOVE_MAX_LENGTH_MESSAGE,
              },
            ],
          }),
          true
        );
      });

      it("email is undefined", async () => {
        req.body.email = undefined;

        for (const middleware of registrationRulesArray) {
          await middleware(req as Request, res as Response, next);
        }

        statusStub = res.status as SinonStub;
        jsonSpy = res.json as SinonSpy;

        assert.strictEqual(statusStub.calledWith(httpCodes.BAD_REQUEST), true);
        assert.strictEqual(
          jsonSpy.calledWith({
            message: commonResponseMessages.BAD_REQUEST,
            errors: [
              {
                message: userFailedValidation.EMAIL_REQUIRED_MESSAGE,
              },
            ],
          }),
          true
        );
      });

      invalidUserInputs.EMAIL_INVALID_CASES.forEach(
        ([testName, invalidEmail]) => {
          it(testName, async () => {
            req.body.email = invalidEmail;

            for (const middleware of registrationRulesArray) {
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
                message: commonResponseMessages.BAD_REQUEST,
                errors: [
                  {
                    message: userFailedValidation.EMAIL_INVALID_MESSAGE,
                  },
                ],
              }),
              true
            );
          });
        }
      );

      it("password is undefined", async () => {
        req.body.password = undefined;

        for (const middleware of registrationRulesArray) {
          await middleware(req as Request, res as Response, next);
        }

        statusStub = res.status as SinonStub;
        jsonSpy = res.json as SinonSpy;

        assert.strictEqual(statusStub.calledWith(httpCodes.BAD_REQUEST), true);
        assert.strictEqual(
          jsonSpy.calledWith({
            message: commonResponseMessages.BAD_REQUEST,
            errors: [
              {
                message: userFailedValidation.PASSWORD_REQUIRED_MESSAGE,
              },
            ],
          }),
          true
        );
      });

      it("password is too short", async () => {
        req.body.password = invalidUserInputs.TOO_SHORT_PASSWORD;

        for (const middleware of registrationRulesArray) {
          await middleware(req as Request, res as Response, next);
        }

        statusStub = res.status as SinonStub;
        jsonSpy = res.json as SinonSpy;

        assert.strictEqual(statusStub.calledWith(httpCodes.BAD_REQUEST), true);
        assert.strictEqual(
          jsonSpy.calledWith({
            message: commonResponseMessages.BAD_REQUEST,
            errors: [
              {
                message: userFailedValidation.PASSWORD_BELOW_MIN_LENGTH_MESSAGE,
              },
            ],
          }),
          true
        );
      });

      invalidUserInputs.PASSWORD_INVALID_CASES.forEach(
        ([testName, invalidPassword]) => {
          it(testName, async () => {
            req.body.password = invalidPassword;

            for (const middleware of registrationRulesArray) {
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
                message: commonResponseMessages.BAD_REQUEST,
                errors: [
                  {
                    message:
                      userFailedValidation.PASSWORD_MUST_HAVE_CHARACTERS_MESSAGE,
                  },
                ],
              }),
              true
            );
          });
        }
      );

      it("role is undefined", async () => {
        req.body.role = undefined;

        for (const middleware of registrationRulesArray) {
          await middleware(req as Request, res as Response, next);
        }

        statusStub = res.status as SinonStub;
        jsonSpy = res.json as SinonSpy;

        assert.strictEqual(statusStub.calledWith(httpCodes.BAD_REQUEST), true);
        assert.strictEqual(
          jsonSpy.calledWith({
            message: commonResponseMessages.BAD_REQUEST,
            errors: [
              {
                message: userFailedValidation.ROLE_REQUIRED_MESSAGE,
              },
            ],
          }),
          true
        );
      });

      it("role is invalid", async () => {
        req.body.role = invalidUserInputs.ROLE_INVALID;

        for (const middleware of registrationRulesArray) {
          await middleware(req as Request, res as Response, next);
        }

        statusStub = res.status as SinonStub;
        jsonSpy = res.json as SinonSpy;

        assert.strictEqual(statusStub.calledWith(httpCodes.BAD_REQUEST), true);
        assert.strictEqual(
          jsonSpy.calledWith({
            message: commonResponseMessages.BAD_REQUEST,
            errors: [
              {
                message: userFailedValidation.ROLE_INVALID_MESSAGE,
              },
            ],
          }),
          true
        );
      });
    });
  });
});
