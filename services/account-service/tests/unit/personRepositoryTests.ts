import assert from "assert";
import { NotFoundError } from "errors/notFoundErrorClass";
import { ServerError } from "errors/serverErrorClass";
import { IPerson } from "interfaces/documents/IPerson";
import { IPersonUpdate } from "interfaces/secondary/IPersonUpdate";
import { beforeEach } from "mocha";
import { Person } from "models/Person";
import { Error, Types } from "mongoose";
import {
  addPerson,
  getPersonByUsername,
  updatePerson,
} from "repositories/personRepository";
import sinon, { SinonStub } from "sinon";
import { validPersonInput } from "tests/testInputs";

describe("Person repository unit tests", () => {
  let mockPerson: IPerson;
  let functionStub: SinonStub;
  let mockId: Types.ObjectId;
  let mockUpdateObject: IPersonUpdate;
  let mockUpdatedPerson: IPerson;
  let mockUsername: string;

  describe(`${getPersonByUsername.name}`, () => {
    beforeEach(() => {
      // Reset stubs
      sinon.restore();

      // Stubs
      functionStub = sinon.stub(Person, "findOne");

      // Mocks
      mockPerson = new Person();
      mockUsername = validPersonInput.username;
    });

    it("Promise resolves to Person object", async () => {
      functionStub.resolves(mockPerson);

      const foundPerson = await getPersonByUsername(mockUsername);

      assert(foundPerson instanceof Person);
    });

    it("Promise resolves to null -> NotFoundError", async () => {
      functionStub.resolves(null);

      try {
        await getPersonByUsername(mockUsername);
      } catch (error) {
        assert(error instanceof NotFoundError);
      }
    });

    it("Promise rejects -> ServerError", async () => {
      functionStub.rejects();

      try {
        await getPersonByUsername(mockUsername);
      } catch (error) {
        assert(error instanceof ServerError);
      }
    });
  });

  describe(`${addPerson.name}`, () => {
    beforeEach(() => {
      // Reset stubs
      sinon.restore();

      // Stubs
      functionStub = sinon.stub(Person.prototype, "save");

      // Mocks
      mockPerson = new Person(validPersonInput);
    });

    it("Promise resolves to Person object", async () => {
      functionStub.resolves(mockPerson);

      const foundPerson = await addPerson(mockPerson);

      assert(foundPerson instanceof Person);
    });

    it("Promise rejects -> Error.ValidationError", async () => {
      functionStub.rejects(new Error.ValidationError());

      try {
        await addPerson(mockPerson);
      } catch (error) {
        assert(error instanceof Error.ValidationError);
      }
    });

    it("Promise rejects -> ServerError", async () => {
      functionStub.rejects();

      try {
        await addPerson(mockPerson);
      } catch (error) {
        assert(error instanceof ServerError);
      }
    });
  });

  describe(`${updatePerson.name}`, () => {
    beforeEach(() => {
      // Reset stubs
      sinon.restore();

      // Stubs
      functionStub = sinon.stub(Person, "findByIdAndUpdate");

      // Mocks
      mockId = new Types.ObjectId("67d4586d7358eafb26e3c195");
      mockUpdateObject = {
        id: mockId,
        username: "mockUser",
      };
      mockUpdatedPerson = new Person({ _id: mockId });
    });

    it("Promise resolves to Person object", async () => {
      functionStub.resolves(mockUpdatedPerson);

      const updatedPerson = await updatePerson(mockUpdateObject);

      assert(updatedPerson instanceof Person);
      assert.strictEqual(updatedPerson._id, mockId);
    });

    it("Promise resolves to null -> NotFoundError", async () => {
      functionStub.resolves(null);

      try {
        await updatePerson(mockUpdateObject);
      } catch (error) {
        assert(error instanceof NotFoundError);
      }
    });

    it("Promise rejects -> ServerError", async () => {
      functionStub.rejects();

      try {
        await updatePerson(mockUpdateObject);
      } catch (error) {
        assert(error instanceof ServerError);
      }
    });
  });
});
