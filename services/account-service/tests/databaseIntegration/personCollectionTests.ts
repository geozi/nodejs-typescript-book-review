import assert from "assert";
import { callPersonAddition } from "controllers/personController";
import { Request, Response } from "express";
import { Person } from "models/Person";
import { User } from "models/User";
import mongoose, { ConnectOptions } from "mongoose";
import { httpCodes } from "resources/codes/responseStatusCodes";
import sinon, { SinonStub } from "sinon";
import { validPersonInput, validUserInput } from "tests/testInputs";

describe("Person collection integration tests", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let setHeaderStub: SinonStub;
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
    // Reset stubs and spies
    sinon.restore();

    // Stubs and spies
    res = {
      setHeader: sinon.stub().callsFake(() => res) as unknown as SinonStub,
      status: sinon.stub().callsFake(() => {
        return res;
      }) as unknown as SinonStub,
      json: sinon.spy(),
    };

    // HTTP request
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
    await callPersonAddition(req as Request, res as Response);

    statusStub = res.status as SinonStub;
    setHeaderStub = res.setHeader as SinonStub;

    assert.strictEqual(setHeaderStub.called, true);
    assert.strictEqual(statusStub.calledWith(httpCodes.CREATED), true);
  });
});
