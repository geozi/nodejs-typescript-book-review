import { IRequest } from "interfaces/secondary/iRequest.interface";
import sinon, { SinonSpy, SinonStub } from "sinon";
import { Response } from "express";
import { Person } from "models/person.model";
import { validPersonInput, validUserInput } from "../../testInputs";
import { User } from "models/user.model";
import assert from "assert";
import { callPersonUpdate } from "controllers/person.controller";
import { httpCodes } from "resources/codes/responseStatusCodes";
import { personControllerResponseMessages } from "messages/response/personControllerResponse.message";
import { commonResponseMessages } from "messages/response/commonResponse.message";

describe("Person update integration tests", () => {
  let req: Partial<IRequest>;
  let res: Partial<Response>;
  let statusStub: SinonStub;
  let jsonSpy: SinonSpy;
  let setHeaderStub: SinonStub;
  let functionStub: SinonStub;
  const mockPerson = new Person(validPersonInput);
  const mockUser = new User(validUserInput);

  describe("Positive scenario(s)", () => {
    beforeEach(() => {
      sinon.restore();
      functionStub = sinon.stub(Person, "findByIdAndUpdate");
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
            id: mockPerson._id.toString(),
            firstName: validPersonInput.firstName,
            lastName: validPersonInput.lastName,
            ssn: validPersonInput.ssn,
            phoneNumber: validPersonInput.phoneNumber,
            address: validPersonInput.address,
          })
        ),
        user: mockUser,
      };
    });

    it("ok (200)", async () => {
      functionStub.resolves(mockPerson);

      await callPersonUpdate(req as IRequest, res as Response);

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;
      setHeaderStub = res.setHeader as SinonStub;

      assert.strictEqual(setHeaderStub.called, true);
      assert.strictEqual(statusStub.calledWith(httpCodes.OK), true);
      assert.strictEqual(
        jsonSpy.calledWith({
          message: personControllerResponseMessages.PERSON_INFO_UPDATED_MESSAGE,
          data: mockPerson,
        }),
        true
      );
    });
  });

  describe("Negative scenarios", () => {
    beforeEach(() => {
      sinon.restore();
      functionStub = sinon.stub(Person, "findByIdAndUpdate");
      res = {
        status: sinon.stub().callsFake(() => {
          return res;
        }) as unknown as SinonStub,
        json: sinon.spy(),
      };

      req = {
        body: JSON.parse(
          JSON.stringify({
            id: mockPerson._id.toString(),
            firstName: validPersonInput.firstName,
            lastName: validPersonInput.lastName,
            ssn: validPersonInput.ssn,
            phoneNumber: validPersonInput.phoneNumber,
            address: validPersonInput.address,
          })
        ),
        user: mockUser,
      };
    });

    it("server error (500)", async () => {
      functionStub.rejects();

      await callPersonUpdate(req as IRequest, res as Response);

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
      functionStub.resolves(null);

      await callPersonUpdate(req as IRequest, res as Response);

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(statusStub.calledWith(httpCodes.NOT_FOUND), true);
      assert.strictEqual(
        jsonSpy.calledWith({
          message:
            personControllerResponseMessages.PERSON_INFO_NOT_FOUND_MESSAGE,
        }),
        true
      );
    });
  });
});
