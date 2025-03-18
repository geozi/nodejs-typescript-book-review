import sinon, { SinonSpy, SinonStub } from "sinon";
import { testToken, validUserInput } from "../../testInputs";
import { Request, Response } from "express";
import assert from "assert";
import { User } from "models/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { redisClient } from "../../../redis.config";
import { loginUser } from "auth/auth.controller";
import { httpCodes } from "resources/codes/responseStatusCodes";
import { authResponseMessages } from "auth/authResponse.message";
import { commonResponseMessages } from "messages/response/commonResponse.message";
import { AbortError, ErrorReply } from "redis";

describe("User login integration tests", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusStub: SinonStub;
  let jsonSpy: SinonSpy;
  let setHeaderStub: SinonStub;
  let findOneStub: SinonStub;
  let bcryptCompareStub: SinonStub;
  let jwtSignStub: SinonStub;
  let redisSetStub: SinonStub;
  const mockCredentials = {
    username: validUserInput.username,
    password: validUserInput.password,
  };
  const mockUser = new User(validUserInput);

  describe("Login success", () => {
    beforeEach(() => {
      sinon.restore();
      res = {
        setHeader: sinon.stub().callsFake(() => res) as unknown as SinonStub,
        status: sinon.stub().callsFake(() => {
          return res;
        }) as unknown as SinonStub,
        json: sinon.spy(),
      };

      req = { body: JSON.parse(JSON.stringify(mockCredentials)) };

      findOneStub = sinon.stub(User, "findOne");
      bcryptCompareStub = sinon.stub(bcrypt, "compare");
      jwtSignStub = sinon.stub(jwt, "sign");
      redisSetStub = sinon.stub(redisClient, "hSet");
    });

    it("request has valid inputs", async () => {
      findOneStub.resolves(mockUser);
      bcryptCompareStub.resolves(true);
      redisSetStub.resolves("OK");
      jwtSignStub.returns(testToken);

      await loginUser(req as Request, res as Response);

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;
      setHeaderStub = res.setHeader as SinonStub;

      assert.strictEqual(setHeaderStub.called, true);
      assert.strictEqual(statusStub.calledWith(httpCodes.OK), true);
      assert.strictEqual(
        jsonSpy.calledWith({
          message: authResponseMessages.AUTHENTICATION_SUCCESS,
          token: testToken,
        }),
        true
      );
    });
  });

  describe("Login failure", () => {
    beforeEach(() => {
      sinon.restore();
      res = {
        status: sinon.stub().callsFake(() => {
          return res;
        }) as unknown as SinonStub,
        json: sinon.spy(),
      };

      req = { body: JSON.parse(JSON.stringify(mockCredentials)) };

      findOneStub = sinon.stub(User, "findOne");
      bcryptCompareStub = sinon.stub(bcrypt, "compare");
      jwtSignStub = sinon.stub(jwt, "sign");
      redisSetStub = sinon.stub(redisClient, "hSet");
    });

    it("server error (500)", async () => {
      findOneStub.rejects();

      await loginUser(req as Request, res as Response);

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

    it("not found -> unauthorized (401)", async () => {
      findOneStub.resolves(null);

      await loginUser(req as Request, res as Response);

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(statusStub.calledWith(httpCodes.UNAUTHORIZED), true);
      assert.strictEqual(
        jsonSpy.calledWith({
          message: authResponseMessages.AUTHENTICATION_FAILED,
        }),
        true
      );
    });

    it("password does not match -> unauthorized (401)", async () => {
      findOneStub.resolves(mockUser);
      bcryptCompareStub.resolves(false);

      await loginUser(req as Request, res as Response);

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(statusStub.calledWith(httpCodes.UNAUTHORIZED), true);
      assert.strictEqual(
        jsonSpy.calledWith({
          message: authResponseMessages.AUTHENTICATION_FAILED,
        }),
        true
      );
    });

    it("ErrorReply (500)", async () => {
      findOneStub.resolves(mockUser);
      bcryptCompareStub.resolves(true);
      redisSetStub.rejects(new ErrorReply(commonResponseMessages.REDIS_ERROR));

      await loginUser(req as Request, res as Response);

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(
        statusStub.calledWith(httpCodes.INTERNAL_SERVER_ERROR),
        true
      );
      assert.strictEqual(
        jsonSpy.calledWith({ message: commonResponseMessages.REDIS_ERROR }),
        true
      );
    });

    it("AbortError (500)", async () => {
      findOneStub.resolves(mockUser);
      bcryptCompareStub.resolves(true);
      redisSetStub.rejects(new AbortError());

      await loginUser(req as Request, res as Response);

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(
        statusStub.calledWith(httpCodes.INTERNAL_SERVER_ERROR),
        true
      );
      assert.strictEqual(
        jsonSpy.calledWith({ message: commonResponseMessages.REDIS_ERROR }),
        true
      );
    });
  });
});
