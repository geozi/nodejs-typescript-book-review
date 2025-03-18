import { Person } from "models/person.model";
import mongoose, { ConnectOptions } from "mongoose";
import sinon, { SinonStub } from "sinon";
import { Response } from "express";
import { validPersonInput } from "../testInputs";
import { validUserInput } from "../testInputs";
import { User } from "models/user.model";
import { IRequest } from "interfaces/secondary/iRequest.interface";
import { callPersonAddition } from "controllers/person.controller";
import { httpCodes } from "resources/codes/responseStatusCodes";
import assert from "assert";

describe("Person collection integration tests", () => {
  let req: Partial<IRequest>;
  let res: Partial<Response>;
  let statusStub: SinonStub;
  const mockUser = new User(validUserInput);

  before(async () => {
    await mongoose.connect(
      process.env.MONGODB_URI as string,
      { useNewUrlParser: true } as ConnectOptions
    );
  });

  after(async () => {
    await Person.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(() => {
    sinon.restore();
    res = {
      status: sinon.stub().callsFake(() => {
        return res;
      }) as unknown as SinonStub,
      json: sinon.spy(),
    };

    req = {
      body: {
        firstName: validPersonInput.firstName,
        lastName: validPersonInput.lastName,
        ssn: validPersonInput.ssn,
        phoneNumber: validPersonInput.phoneNumber,
        address: validPersonInput.address,
      },
      user: mockUser,
    };
  });

  it("new person added (201)", async () => {
    await callPersonAddition(req as IRequest, res as Response);

    statusStub = res.status as SinonStub;

    assert.strictEqual(statusStub.calledWith(httpCodes.CREATED), true);
  });
});
