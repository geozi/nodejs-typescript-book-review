import assert from "assert";
import { NotFoundError } from "errors/notFoundErrorClass";
import { IPerson } from "interfaces/documents/IPerson";
import { IPersonUpdate } from "interfaces/secondary/IPersonUpdate";
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

  describe(`${getPersonByUsername.name}`, () => {
    beforeEach(() => {
      sinon.restore();
      functionStub = sinon.stub(Person, "findOne");
      mockPerson = new Person();
    });

    it("Promise resolves to Person object", async () => {
      functionStub.resolves(mockPerson);

      const foundPerson = await getPersonByUsername(validPersonInput.username);

      assert(foundPerson instanceof Person);
    });

    it("Promise resolves to null", async () => {
      functionStub.resolves(null);

      try {
        await getPersonByUsername(validPersonInput.username);
      } catch (error) {
        assert(error instanceof NotFoundError);
      }
    });
  });

  describe(`${addPerson.name}`, () => {
    beforeEach(() => {
      sinon.restore();
      functionStub = sinon.stub(Person.prototype, "save");
      mockPerson = new Person(validPersonInput);
    });

    it("Promise resolves to Person object", async () => {
      functionStub.resolves(mockPerson);

      const foundPerson = await addPerson(mockPerson);

      assert(foundPerson instanceof Person);
    });

    it("Promise rejects with Error.ValidationError", async () => {
      functionStub.rejects(new Error.ValidationError());

      try {
        await addPerson(mockPerson);
      } catch (error) {
        assert(error instanceof Error.ValidationError);
      }
    });
  });

  describe(`${updatePerson.name}`, () => {
    let mockId: Types.ObjectId;
    let mockUpdateObject: IPersonUpdate;
    let mockUpdatedPerson: IPerson;

    beforeEach(() => {
      sinon.restore();
      functionStub = sinon.stub(Person, "findByIdAndUpdate");
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

    it("Promise resolves to null", async () => {
      functionStub.resolves(null);

      try {
        await updatePerson(mockUpdateObject);
      } catch (error) {
        assert(error instanceof NotFoundError);
      }
    });
  });
});
