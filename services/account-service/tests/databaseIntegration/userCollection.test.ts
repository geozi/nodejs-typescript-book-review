import assert from "assert";
import mongoose, { ConnectOptions } from "mongoose";
import sinon, { SinonStub } from "sinon";
import * as dotenv from "dotenv";
import { User } from "models/user.model";
import { Request, Response } from "express";
import { validUserInput } from "../testInputs";
import { callUserRegistration } from "controllers/user.controller";
import { httpCodes } from "resources/codes/responseStatusCodes";
dotenv.config();

describe("User collection integration tests", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let setHeaderStub: SinonStub;
  let statusStub: SinonStub;

  before(async () => {
    await mongoose.connect(
      process.env.MONGODB_URI as string,
      { useNewUrlParser: true } as ConnectOptions
    );
  });

  after(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(() => {
    sinon.restore();
    res = {
      setHeader: sinon.stub().callsFake(() => res) as unknown as SinonStub,
      status: sinon.stub().callsFake(() => {
        return res;
      }) as unknown as SinonStub,
      json: sinon.spy(),
    };
  });

  it("new user registered (201)", async () => {
    req = {
      body: {
        username: validUserInput.username,
        email: validUserInput.email,
        password: validUserInput.password,
        role: validUserInput.role.toString(),
      },
    };

    await callUserRegistration(req as Request, res as Response);

    statusStub = res.status as SinonStub;
    setHeaderStub = res.setHeader as SinonStub;

    assert.strictEqual(setHeaderStub.called, true);
    assert.strictEqual(statusStub.calledWith(httpCodes.CREATED), true);
  });
});
