import { Request, Response } from "express";
import { User } from "models/user.model";
import sinon, { SinonSpy, SinonStub } from "sinon";
import { validUserInput } from "../../tests/testInputs";
import { callUserRegistration } from "controllers/user.controller";
import assert from "assert";
import { httpCodes } from "resources/codes/responseStatusCodes";
import { Error } from "mongoose";
import { commonResponseMessages } from "messages/response/commonResponse.message";
import { userControllerResponseMessages } from "messages/response/userControllerResponse.message";

describe("User controller registration integration tests", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusStub: SinonStub;
  let jsonSpy: SinonSpy;
  let functionStub: SinonStub;
  const mockUser = new User(validUserInput);

  describe("Positive scenarios", () => {
    beforeEach(() => {
      sinon.restore();
      functionStub = sinon.stub(User.prototype, "save");
      res = {
        status: sinon.stub().callsFake(() => {
          return res;
        }) as unknown as SinonStub,
        json: sinon.spy(),
      };

      req = { body: JSON.parse(JSON.stringify(validUserInput)) };
    });

    it("created (201)", async () => {
      functionStub.resolves(mockUser);

      await callUserRegistration(req as Request, res as Response);

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(statusStub.calledWith(httpCodes.CREATED), true);
      assert.strictEqual(
        jsonSpy.calledWith({
          message: userControllerResponseMessages.USER_REGISTERED,
          data: mockUser,
        }),
        true
      );
    });
  });

  describe("Negative scenarios", () => {
    beforeEach(() => {
      sinon.restore();
      functionStub = sinon.stub(User.prototype, "save");
      res = {
        status: sinon.stub().callsFake(() => {
          return res;
        }) as unknown as SinonStub,
        json: sinon.spy(),
      };

      req = { body: JSON.parse(JSON.stringify(validUserInput)) };
    });

    it("server error (500)", async () => {
      functionStub.rejects();

      await callUserRegistration(req as Request, res as Response);

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(
        statusStub.calledWith(httpCodes.INTERNAL_SERVER_ERROR),
        true
      );
      assert.strictEqual(
        jsonSpy.calledWith({ message: commonResponseMessages.SERVER_ERROR }),
        true
      );
    });

    it("Error.ValidationError (400)", async () => {
      functionStub.rejects(new Error.ValidationError());

      await callUserRegistration(req as Request, res as Response);

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(statusStub.calledWith(httpCodes.BAD_REQUEST), true);
      assert.strictEqual(
        jsonSpy.calledWith({
          message: commonResponseMessages.BAD_REQUEST,
          errors: "Validation failed",
        }),
        true
      );
    });
  });
});
