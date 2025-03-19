import { catchExpressValidationErrors } from "middleware/expressError.catch";
import { userUpdateRules } from "middleware/user.rule";
import sinon, { SinonSpy, SinonStub } from "sinon";
import { Request, Response } from "express";
import assert from "assert";
import { invalidUserInputs, validUserInput } from "../../testInputs";
import { httpCodes } from "resources/codes/responseStatusCodes";
import { commonResponseMessages } from "messages/response/commonResponse.message";
import { userFailedValidation } from "messages/validation/userValidation.message";
import { User } from "models/user.model";

describe("User update rules integration tests", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: SinonSpy;
  let statusStub: SinonStub;
  let jsonSpy: SinonSpy;
  const mockUser = new User(validUserInput);
  const updateRulesArray = [...userUpdateRules(), catchExpressValidationErrors];

  describe("Positive scenario(s)", () => {
    beforeEach(() => {
      sinon.restore();
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
            username: validUserInput.username,
            email: validUserInput.email,
            password: validUserInput.password,
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
        sinon.restore();

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
              username: validUserInput.username,
              email: validUserInput.email,
              password: validUserInput.password,
            })
          ),
          user: mockUser,
        };
      });

      invalidUserInputs.EMAIL_INVALID_CASES.forEach(
        ([testName, invalidEmail]) => {
          it(testName, async () => {
            req.body.email = invalidEmail;

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

      it("password is too short", async () => {
        req.body.password = invalidUserInputs.TOO_SHORT_PASSWORD;

        for (const middleware of updateRulesArray) {
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
    });
  });
});
