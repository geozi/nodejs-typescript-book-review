import assert from "assert";
import { callReviewAddition } from "controllers/reviewController";
import * as dotenv from "dotenv";
import { Request, Response } from "express";
import { IUser } from "interfaces/secondary/IUser";
import { Review } from "models/Review";
import mongoose, { ConnectOptions } from "mongoose";
import { httpCodes } from "resources/codes/responseStatusCodes";
import sinon, { SinonStub } from "sinon";
import { validReviewInputs, validUserInput } from "tests/testInputs";
dotenv.config();

describe("Review collection integration tests", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let setHeaderStub: SinonStub;
  let statusStub: SinonStub;
  let mockUser: IUser;

  before(async () => {
    await mongoose.connect(
      process.env.MONGODB_URI as string,
      { useNewUrlParser: true } as ConnectOptions
    );
  });

  after(async () => {
    await Review.deleteMany({});
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

    // Mocks
    mockUser = validUserInput;

    // HTTP request
    req = {
      body: JSON.parse(
        JSON.stringify({
          subject: validReviewInputs.subject,
          description: validReviewInputs.description,
          book: validReviewInputs.book,
          username: mockUser.username,
        })
      ),
    };
  });

  it("new review added (201)", async () => {
    await callReviewAddition(req as Request, res as Response);

    statusStub = res.status as SinonStub;
    setHeaderStub = res.setHeader as SinonStub;

    assert.strictEqual(setHeaderStub.called, true);
    assert.strictEqual(statusStub.calledWith(httpCodes.CREATED), true);
  });
});
