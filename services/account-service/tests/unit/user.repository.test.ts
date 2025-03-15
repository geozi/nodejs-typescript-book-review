import { IUser } from "interfaces/documents/iUser.interface";
import { User } from "models/user.model";
import sinon, { SinonStub } from "sinon";
import assert from "assert";
import {
  addUser,
  getUserByUsername,
  updateUser,
} from "repositories/user.repository";
import { validUserInput } from "../../tests/testInputs";
import { Error, Types } from "mongoose";
import { IUserUpdate } from "interfaces/secondary/iUserUpdate.interface";
import { NotFoundError } from "errors/notFoundError.class";

describe("User repository unit tests", () => {
  let mockUser: IUser;
  let functionStub: SinonStub;

  describe(`${getUserByUsername.name}`, () => {
    beforeEach(() => {
      sinon.restore();
      functionStub = sinon.stub(User, "findOne");
      mockUser = new User();
    });

    it("Promise resolves to User object", async () => {
      functionStub.resolves(mockUser);

      const foundUser = await getUserByUsername(validUserInput.username);

      assert(foundUser instanceof User);
    });

    it("Promise resolves to null", async () => {
      functionStub.resolves(null);

      const foundUser = await getUserByUsername(validUserInput.username);

      assert.strictEqual(foundUser, null);
    });
  });

  describe(`${addUser.name}`, () => {
    beforeEach(() => {
      sinon.restore();
      functionStub = sinon.stub(User.prototype, "save");
      mockUser = new User(validUserInput);
    });

    it("Promise resolves to User object", async () => {
      functionStub.resolves(mockUser);

      const savedUser = await addUser(mockUser);

      assert(savedUser instanceof User);
    });

    it("Promise rejects with Error.ValidationError", async () => {
      functionStub.rejects(new Error.ValidationError());

      try {
        await addUser(mockUser);
      } catch (error) {
        assert(error instanceof Error.ValidationError);
      }
    });
  });

  describe(`${updateUser.name}`, () => {
    let mockId: Types.ObjectId;
    let mockUpdateObject: IUserUpdate;
    let mockUpdatedUser: IUser;

    beforeEach(() => {
      sinon.restore();
      functionStub = sinon.stub(User, "findByIdAndUpdate");
      mockId = new Types.ObjectId("67d314596811d64dd1248fd2");
      mockUpdateObject = {
        id: mockId,
      };
      mockUpdatedUser = new User({ _id: mockId });
    });

    it("Promise resolves to User object", async () => {
      functionStub.resolves(mockUpdatedUser);

      const updatedUser = await updateUser(mockUpdateObject);

      assert(updatedUser instanceof User);
      assert.strictEqual(updatedUser._id, mockId);
    });

    it("Promise resolves to null", async () => {
      functionStub.resolves(null);

      try {
        await updateUser(mockUpdateObject);
      } catch (error) {
        assert(error instanceof NotFoundError);
      }
    });
  });
});
