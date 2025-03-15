import { Request, Response } from "express";
import { User } from "models/user.model";
import sinon, { SinonSpy, SinonStub } from "sinon";
import { validUserInput } from "../../tests/testInputs";
import { callUserRegistration } from "controllers/user.controller";
import assert from "assert";
import { httpCodes } from "resources/codes/responseStatusCodes";

describe.only("User controller registration integration tests", () => {
  describe("Negative scenarios", async () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: SinonSpy;
    let statusStub: SinonStub;
    let jsonSpy: SinonSpy;
    let functionStub: SinonStub;

    beforeEach(() => {
      sinon.restore();
      functionStub = sinon.stub(User.prototype, "save");
      res = {
        status: sinon.stub().callsFake(() => {
          return res;
        }) as unknown as SinonStub,
        json: sinon.spy(),
      };

      next = sinon.spy();
      req = { body: JSON.parse(JSON.stringify(validUserInput)) };
    });

    it("server error (500)", async () => {
      functionStub.rejects();

      await callUserRegistration(req as Request, res as Response);

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(
        statusStub.calledWith(httpCodes.INTERNAL_SERVER_ERROR),
        true
      );
    });
  });
});
