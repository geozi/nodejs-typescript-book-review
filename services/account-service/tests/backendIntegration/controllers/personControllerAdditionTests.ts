import assert from "assert";
import { callPersonAddition } from "controllers/personController";
import { Response } from "express";
import { IRequest } from "interfaces/secondary/IRequest";
import { commonResponseMessages } from "messages/response/commonResponseMessages";
import { personControllerResponseMessages } from "messages/response/personControllerResponseMessages";
import { Person } from "models/Person";
import { User } from "models/User";
import { Error } from "mongoose";
import { httpCodes } from "resources/codes/responseStatusCodes";
import sinon, { SinonSpy, SinonStub } from "sinon";
import { validPersonInput, validUserInput } from "tests/testInputs";

describe("Personal info addition integration tests", () => {
  let req: Partial<IRequest>;
  let res: Partial<Response>;
  let statusStub: SinonStub;
  let jsonSpy: SinonSpy;
  let setHeaderStub: SinonStub;
  let functionStub: SinonStub;
  const mockPerson = new Person(validPersonInput);
  const mockUser = new User(validUserInput);

  describe("Positive scenario", () => {
    beforeEach(() => {
      // Reset stubs and spies
      sinon.restore();

      // Stubs and spies
      functionStub = sinon.stub(Person.prototype, "save");
      res = {
        setHeader: sinon.stub().callsFake(() => res) as unknown as SinonStub,
        status: sinon.stub().callsFake(() => {
          return res;
        }) as unknown as SinonStub,
        json: sinon.spy(),
      };

      // HTTP request
      req = {
        body: JSON.parse(JSON.stringify(validPersonInput)),
        user: mockUser,
      };
    });

    it("response code 201", async () => {
      functionStub.resolves(mockPerson);

      await callPersonAddition(req as IRequest, res as Response);

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;
      setHeaderStub = res.setHeader as SinonStub;

      assert.strictEqual(setHeaderStub.called, true);
      assert.strictEqual(statusStub.calledWith(httpCodes.CREATED), true);
      assert.strictEqual(
        jsonSpy.calledWith({
          message: personControllerResponseMessages.PERSON_INFO_ADDED_MESSAGE,
          data: mockPerson,
        }),
        true
      );
    });
  });

  describe("Negative scenarios", () => {
    beforeEach(() => {
      // Reset stubs and spies
      sinon.restore();

      // Stubs and spies
      functionStub = sinon.stub(Person.prototype, "save");
      res = {
        status: sinon.stub().callsFake(() => {
          return res;
        }) as unknown as SinonStub,
        json: sinon.spy(),
      };

      // HTTP request
      req = {
        body: JSON.parse(JSON.stringify(validPersonInput)),
        user: mockUser,
      };
    });

    it("response code 500", async () => {
      functionStub.rejects();

      await callPersonAddition(req as IRequest, res as Response);

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

    it("response code 400", async () => {
      functionStub.rejects(new Error.ValidationError());

      await callPersonAddition(req as IRequest, res as Response);

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(statusStub.calledWith(httpCodes.BAD_REQUEST), true);
      assert.strictEqual(
        jsonSpy.calledWith({
          message: commonResponseMessages.BAD_REQUEST_MESSAGE,
          errors: "Validation failed",
        }),
        true
      );
    });
  });
});
