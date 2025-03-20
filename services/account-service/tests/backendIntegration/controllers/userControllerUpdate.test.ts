import { IRequest } from "interfaces/secondary/iRequest.interface";
import sinon, { SinonSpy, SinonStub } from "sinon";
import { validUserInput } from "../../testInputs";
import { User } from "models/user.model";
import { Request, Response } from "express";
import { callUserUpdate } from "controllers/user.controller";
import assert from "assert";
import { httpCodes } from "resources/codes/responseStatusCodes";
import { userControllerResponseMessages } from "messages/response/userControllerResponse.message";
import { commonResponseMessages } from "messages/response/commonResponse.message";
import bcrypt from "bcryptjs";
import { redisClient } from "../../../redis.config";
import { AbortError, ErrorReply } from "redis";

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
