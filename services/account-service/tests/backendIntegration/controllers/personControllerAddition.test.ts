import { Person } from "models/person.model";
import sinon, { SinonSpy, SinonStub } from "sinon";
import { validPersonInput, validUserInput } from "../../testInputs";
import { IRequest } from "interfaces/secondary/iRequest.interface";
import { Response } from "express";
import { callPersonAddition } from "controllers/person.controller";
import assert from "assert";
import { httpCodes } from "resources/codes/responseStatusCodes";
import { personControllerResponseMessages } from "messages/response/personControllerResponse.message";
import { User } from "models/user.model";
import { commonResponseMessages } from "messages/response/commonResponse.message";
import { Error } from "mongoose";

describe("Personal info addition integration tests", () => {
  let req: Partial<IRequest>;
  let res: Partial<Response>;
  let statusStub: SinonStub;
  let jsonSpy: SinonSpy;
  let functionStub: SinonStub;
  const mockPerson = new Person(validPersonInput);
  const mockUser = new User(validUserInput);

  describe("Positive scenarios", () => {
    beforeEach(() => {
      sinon.restore();
      functionStub = sinon.stub(Person.prototype, "save");
      res = {
        status: sinon.stub().callsFake(() => {
          return res;
        }) as unknown as SinonStub,
        json: sinon.spy(),
      };

      req = {
        body: JSON.parse(JSON.stringify(validPersonInput)),
        user: mockUser,
      };
    });

    it("created (201)", async () => {
      functionStub.resolves(mockPerson);

      await callPersonAddition(req as IRequest, res as Response);

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

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
      sinon.restore();
      functionStub = sinon.stub(Person.prototype, "save");
      res = {
        status: sinon.stub().callsFake(() => {
          return res;
        }) as unknown as SinonStub,
        json: sinon.spy(),
      };

      req = {
        body: JSON.parse(JSON.stringify(validPersonInput)),
        user: mockUser,
      };
    });

    it("server error (500)", async () => {
      functionStub.rejects();

      await callPersonAddition(req as IRequest, res as Response);

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(
        statusStub.calledWith(httpCodes.INTERNAL_SERVER_ERROR),
        true
      );
      assert.strictEqual(
        jsonSpy.calledWith({ message: commonResponseMessages.SERVER_ERROR }),
        true
      );
    });

    it("Error.ValidationError (400)", async () => {
      functionStub.rejects(new Error.ValidationError());

      await callPersonAddition(req as IRequest, res as Response);

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(statusStub.calledWith(httpCodes.BAD_REQUEST), true);
      assert.strictEqual(
        jsonSpy.calledWith({
          message: commonResponseMessages.BAD_REQUEST,
          errors: "Validation failed",
        }),
        true
      );
    });
  });
});
