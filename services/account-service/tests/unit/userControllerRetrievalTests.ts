import assert from "assert";
import { retrieveUser } from "controllers/userController";
import { Request, Response } from "express";
import { userControllerResponseMessages } from "messages/response/userControllerResponseMessages";
import { User } from "models/User";
import { httpCodes } from "resources/codes/responseStatusCodes";
import sinon, { SinonSpy, SinonStub } from "sinon";
import { validUserInput } from "tests/testInputs";

describe("User controller retrieval unit tests", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusStub: SinonStub;
  let jsonSpy: SinonSpy;
  let setHeaderStub: SinonStub;
  const mockUser = new User(validUserInput);

  describe("Positive scenario(s)", () => {
    beforeEach(() => {
      sinon.restore();
      res = {
        setHeader: sinon.stub().callsFake(() => res) as unknown as SinonStub,
        status: sinon.stub().callsFake(() => res) as unknown as SinonStub,
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
    });

    it("request has valid inputs", async () => {
      retrieveUser(req as Request, res as Response);

      setHeaderStub = res.setHeader as SinonStub;
      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(setHeaderStub.called, true);
      assert.strictEqual(statusStub.calledWith(httpCodes.OK), true);
      assert.strictEqual(
        jsonSpy.calledWith({
          message: userControllerResponseMessages.USER_RETRIEVED_MESSAGE,
          data: mockUser,
        }),
        true
      );
    });
  });
});
