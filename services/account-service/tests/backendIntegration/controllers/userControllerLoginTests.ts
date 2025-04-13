import assert from "assert";
import { loginUser } from "auth/authController";
import { authResponseMessages } from "auth/authResponseMessages";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { commonResponseMessages } from "messages/response/commonResponseMessages";
import { User } from "models/User";
import { AbortError, ErrorReply } from "redis";
import { redisClient } from "redis/redis.config";
import { httpCodes } from "resources/codes/responseStatusCodes";
import sinon, { SinonSpy, SinonStub } from "sinon";
import { testToken, validUserInput } from "tests/testInputs";

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
      // Reset stubs and spies
      sinon.restore();

      // Stubs and spies
      findOneStub = sinon.stub(User, "findOne");
      bcryptCompareStub = sinon.stub(bcrypt, "compare");
      jwtSignStub = sinon.stub(jwt, "sign");
      redisSetStub = sinon.stub(redisClient, "hSet");
      res = {
        setHeader: sinon.stub().callsFake(() => res) as unknown as SinonStub,
        status: sinon.stub().callsFake(() => {
          return res;
        }) as unknown as SinonStub,
        json: sinon.spy(),
      };

      // HTTP request
      req = { body: JSON.parse(JSON.stringify(mockCredentials)) };
    });

    it("response code 200", async () => {
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
      // Reset stubs and spies
      sinon.restore();

      // Stubs and spies
      findOneStub = sinon.stub(User, "findOne");
      bcryptCompareStub = sinon.stub(bcrypt, "compare");
      jwtSignStub = sinon.stub(jwt, "sign");
      redisSetStub = sinon.stub(redisClient, "hSet");
      res = {
        status: sinon.stub().callsFake(() => {
          return res;
        }) as unknown as SinonStub,
        json: sinon.spy(),
      };

      // HTTP request
      req = { body: JSON.parse(JSON.stringify(mockCredentials)) };
    });

    it("response code 500", async () => {
      findOneStub.rejects();

      await loginUser(req as Request, res as Response);

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(
        statusStub.calledWith(httpCodes.INTERNAL_SERVER_ERROR),
        true
      );
      assert.strictEqual(
        jsonSpy.calledWith({
          message: commonResponseMessages.SERVER_ERROR_MESSAGE,
        }),
        true
      );
    });

    it("not found -> response code 401", async () => {
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

    it("password does not match -> response code 401", async () => {
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

    it("ErrorReply -> response code 500", async () => {
      findOneStub.resolves(mockUser);
      bcryptCompareStub.resolves(true);
      redisSetStub.rejects(
        new ErrorReply(commonResponseMessages.REDIS_ERROR_MESSAGE)
      );

      await loginUser(req as Request, res as Response);

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(
        statusStub.calledWith(httpCodes.INTERNAL_SERVER_ERROR),
        true
      );
      assert.strictEqual(
        jsonSpy.calledWith({
          message: commonResponseMessages.REDIS_ERROR_MESSAGE,
        }),
        true
      );
    });

    it("AbortError -> response code 500", async () => {
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
        jsonSpy.calledWith({
          message: commonResponseMessages.REDIS_ERROR_MESSAGE,
        }),
        true
      );
    });
  });
});
