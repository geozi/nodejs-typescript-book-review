import { Request, Response } from "express";
import { User } from "models/user.model";
import sinon, { SinonSpy, SinonStub } from "sinon";
import { validUserInput } from "../../testInputs";
import { callUserRegistration } from "controllers/user.controller";
import assert from "assert";
import { httpCodes } from "resources/codes/responseStatusCodes";
import { Error } from "mongoose";
import { commonResponseMessages } from "messages/response/commonResponse.message";
import { userControllerResponseMessages } from "messages/response/userControllerResponse.message";
import bcrypt from "bcryptjs";

describe("User registration integration tests", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusStub: SinonStub;
  let jsonSpy: SinonSpy;
  let setHeaderStub: SinonStub;
  let userSaveStub: SinonStub;
  let bcryptHashStub: SinonStub;
  const mockUser = new User(validUserInput);

  describe("Positive scenarios", () => {
    beforeEach(() => {
      sinon.restore();
      res = {
        setHeader: sinon.stub().callsFake(() => res) as unknown as SinonStub,
        status: sinon.stub().callsFake(() => {
          return res;
        }) as unknown as SinonStub,
        json: sinon.spy(),
      };

      req = { body: JSON.parse(JSON.stringify(validUserInput)) };
      userSaveStub = sinon.stub(User.prototype, "save");
      bcryptHashStub = sinon.stub(bcrypt, "hash");
    });

    it("created (201)", async () => {
      bcryptHashStub.resolves("hashed_password");
      userSaveStub.resolves(mockUser);

      await callUserRegistration(req as Request, res as Response);

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;
      setHeaderStub = res.setHeader as SinonStub;

      assert.strictEqual(setHeaderStub.called, true);
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

      res = {
        status: sinon.stub().callsFake(() => {
          return res;
        }) as unknown as SinonStub,
        json: sinon.spy(),
      };

      req = { body: JSON.parse(JSON.stringify(validUserInput)) };
      bcryptHashStub = sinon.stub(bcrypt, "hash");
      userSaveStub = sinon.stub(User.prototype, "save");
    });

    it("server error (500)", async () => {
      bcryptHashStub.resolves("hashed_password");
      userSaveStub.rejects();

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
      bcryptHashStub.resolves("hashed_password");
      userSaveStub.rejects(new Error.ValidationError());

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
