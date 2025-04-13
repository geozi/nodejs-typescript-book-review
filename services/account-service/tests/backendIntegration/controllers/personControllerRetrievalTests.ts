import assert from "assert";
import { retrievePersonInfo } from "controllers/personController";
import { Response } from "express";
import { IRequest } from "interfaces/secondary/IRequest";
import { commonResponseMessages } from "messages/response/commonResponseMessages";
import { personControllerResponseMessages } from "messages/response/personControllerResponseMessages";
import { Person } from "models/Person";
import { User } from "models/User";
import { httpCodes } from "resources/codes/responseStatusCodes";
import sinon, { SinonSpy, SinonStub } from "sinon";
import { validPersonInput, validUserInput } from "tests/testInputs";

describe("Person info retrieval integration tests", () => {
  let req: Partial<IRequest>;
  let res: Partial<Response>;
  let statusStub: SinonStub;
  let jsonSpy: SinonSpy;
  let setHeaderStub: SinonStub;
  let findOneStub: SinonStub;
  const mockUser = new User(validUserInput);
  const mockPerson = new Person({
    firstName: validPersonInput.firstName,
    lastName: validPersonInput.lastName,
    ssn: validPersonInput.ssn,
    phoneNumber: validPersonInput.phoneNumber,
    address: validPersonInput.address,
    username: mockUser.username,
  });

  describe("Positive scenario", () => {
    beforeEach(() => {
      // Reset stubs and spies
      sinon.restore();

      // Stubs and spies
      findOneStub = sinon.stub(Person, "findOne");
      res = {
        setHeader: sinon.stub().callsFake(() => res) as unknown as SinonStub,
        status: sinon.stub().callsFake(() => {
          return res;
        }) as unknown as SinonStub,
        json: sinon.spy(),
      };

      // HTTP request
      req = {
        body: JSON.parse(
          JSON.stringify({
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

    it("response code 200", async () => {
      findOneStub.resolves(mockPerson);
      await retrievePersonInfo(req as IRequest, res as Response);

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;
      setHeaderStub = res.setHeader as SinonStub;

      assert.strictEqual(setHeaderStub.called, true);
      assert.strictEqual(statusStub.calledWith(httpCodes.OK), true);
      assert.strictEqual(
        jsonSpy.calledWith({
          message:
            personControllerResponseMessages.PERSON_INFO_RETRIEVED_MESSAGE,
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
      findOneStub = sinon.stub(Person, "findOne");
      res = {
        status: sinon.stub().callsFake(() => {
          return res;
        }) as unknown as SinonStub,
        json: sinon.spy(),
      };

      // HTTP request
      req = {
        body: JSON.parse(
          JSON.stringify({
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

    it("response code 500", async () => {
      findOneStub.rejects();
      await retrievePersonInfo(req as IRequest, res as Response);

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

    it("response code 404", async () => {
      findOneStub.resolves(null);
      await retrievePersonInfo(req as IRequest, res as Response);

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
