import { IRequest } from "interfaces/secondary/iRequest.interface";
import sinon, { SinonSpy, SinonStub } from "sinon";
import { validUserInput } from "../../testInputs";
import { User } from "models/user.model";
import { Response } from "express";
import { callUserUpdate } from "controllers/user.controller";
import assert from "assert";
import { httpCodes } from "resources/codes/responseStatusCodes";
import { userControllerResponseMessages } from "messages/response/userControllerResponse.message";
import { commonResponseMessages } from "messages/response/commonResponse.message";
import bcrypt from "bcryptjs";
import { redisClient } from "../../../redis.config";

describe("User update integration tests", () => {
  let req: Partial<IRequest>;
  let res: Partial<Response>;
  let statusStub: SinonStub;
  let jsonSpy: SinonSpy;
  let bcryptHashStub: SinonStub;
  let redisDelStub: SinonStub;
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

      redisDelStub = sinon.stub(redisClient, "del");
      redisSetStub = sinon.stub(redisClient, "hSet");
      bcryptHashStub = sinon.stub(bcrypt, "hash");
      userFindByIdAndUpdateStub = sinon.stub(User, "findByIdAndUpdate");
    });

    it("ok (200)", async () => {
      redisDelStub.resolves("OK");
      redisSetStub.resolves("OK");
      bcryptHashStub.resolves("hashed_password");
      userFindByIdAndUpdateStub.resolves(mockUser);

      await callUserUpdate(req as IRequest, res as Response);

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(statusStub.calledWith(httpCodes.OK), true);
      assert.strictEqual(
        jsonSpy.calledWith({
          message: userControllerResponseMessages.USER_UPDATED,
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

      redisDelStub = sinon.stub(redisClient, "del");
      redisSetStub = sinon.stub(redisClient, "hSet");
      bcryptHashStub = sinon.stub(bcrypt, "hash");
      userFindByIdAndUpdateStub = sinon.stub(User, "findByIdAndUpdate");
    });

    it("server error (500)", async () => {
      redisDelStub.resolves("OK");
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
          message: commonResponseMessages.SERVER_ERROR,
        }),
        true
      );
    });

    it("not found (404)", async () => {
      redisDelStub.resolves("OK");
      redisSetStub.resolves("OK");
      bcryptHashStub.resolves("hashed_password");
      userFindByIdAndUpdateStub.resolves(null);

      await callUserUpdate(req as IRequest, res as Response);

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(statusStub.calledWith(httpCodes.NOT_FOUND), true);
      assert.strictEqual(
        jsonSpy.calledWith({
          message: userControllerResponseMessages.USER_NOT_FOUND,
        }),
        true
      );
    });
  });
});
