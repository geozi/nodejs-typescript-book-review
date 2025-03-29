import assert from "assert";
import bcrypt from "bcryptjs";
import { callUserUpdate } from "controllers/userController";
import { Request, Response } from "express";
import { IRequest } from "interfaces/secondary/IRequest";
import { commonResponseMessages } from "messages/response/commonResponseMessages";
import { userControllerResponseMessages } from "messages/response/userControllerResponseMessages";
import { User } from "models/User";
import { AbortError, ErrorReply } from "redis";
import { redisClient } from "redis/redis.config";
import { httpCodes } from "resources/codes/responseStatusCodes";
import sinon, { SinonSpy, SinonStub } from "sinon";
import { validUserInput } from "tests/testInputs";

describe("User update integration tests", () => {
  let req: Partial<IRequest>;
  let res: Partial<Response>;
  let statusStub: SinonStub;
  let jsonSpy: SinonSpy;
  let setHeaderStub: SinonStub;
  let bcryptHashStub: SinonStub;
  let redisSetStub: SinonStub;
  let userFindByIdAndUpdateStub: SinonStub;
  const mockUser = new User({
    username: validUserInput.username,
    email: validUserInput.email,
    password: "hashed_password",
    role: validUserInput.role,
  });

  describe("Positive scenario(s)", () => {
    beforeEach(() => {
      sinon.restore();
      res = {
        setHeader: sinon.stub().callsFake(() => res) as unknown as SinonStub,
        status: sinon.stub().callsFake(() => {
          return res;
        }) as unknown as SinonStub,
        json: sinon.spy(),
      };

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

      redisSetStub = sinon.stub(redisClient, "hSet");
      bcryptHashStub = sinon.stub(bcrypt, "hash");
      userFindByIdAndUpdateStub = sinon.stub(User, "findByIdAndUpdate");
    });

    it("ok (200)", async () => {
      redisSetStub.resolves("OK");
      bcryptHashStub.resolves("hashed_password");
      userFindByIdAndUpdateStub.resolves(mockUser);

      await callUserUpdate(req as IRequest, res as Response);

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;
      setHeaderStub = res.setHeader as SinonStub;

      assert.strictEqual(setHeaderStub.called, true);
      assert.strictEqual(statusStub.calledWith(httpCodes.OK), true);
      assert.strictEqual(
        jsonSpy.calledWith({
          message: userControllerResponseMessages.USER_UPDATED_MESSAGE,
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

      redisSetStub = sinon.stub(redisClient, "hSet");
      bcryptHashStub = sinon.stub(bcrypt, "hash");
      userFindByIdAndUpdateStub = sinon.stub(User, "findByIdAndUpdate");
    });

    it("server error (500)", async () => {
      redisSetStub.resolves("OK");
      bcryptHashStub.resolves("hashed_password");
      userFindByIdAndUpdateStub.rejects();

      await callUserUpdate(req as IRequest, res as Response);

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

    it("not found (404)", async () => {
      redisSetStub.resolves("OK");
      bcryptHashStub.resolves("hashed_password");
      userFindByIdAndUpdateStub.resolves(null);

      await callUserUpdate(req as IRequest, res as Response);

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(statusStub.calledWith(httpCodes.NOT_FOUND), true);
      assert.strictEqual(
        jsonSpy.calledWith({
          message: userControllerResponseMessages.USER_NOT_FOUND_MESSAGE,
        }),
        true
      );
    });

    it("ErrorReply (500)", async () => {
      bcryptHashStub.resolves("hashed_password");
      userFindByIdAndUpdateStub.resolves(mockUser);
      redisSetStub.rejects(
        new ErrorReply(commonResponseMessages.REDIS_ERROR_MESSAGE)
      );

      await callUserUpdate(req as Request, res as Response);

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

    it("AbortError (500)", async () => {
      bcryptHashStub.resolves("hashed_password");
      userFindByIdAndUpdateStub.resolves(mockUser);
      redisSetStub.rejects(new AbortError());

      await callUserUpdate(req as Request, res as Response);

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
