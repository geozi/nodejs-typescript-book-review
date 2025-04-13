import assert from "assert";
import { NotFoundError } from "errors/notFoundErrorClass";
import { ServerError } from "errors/serverErrorClass";
import { IUser } from "interfaces/documents/IUser";
import { IUserUpdate } from "interfaces/secondary/IUserUpdate";
import { User } from "models/User";
import { Error, Types } from "mongoose";
import {
  addUser,
  getUserByUsername,
  updateUser,
} from "repositories/userRepository";
import sinon, { SinonStub } from "sinon";
import { validUserInput } from "tests/testInputs";

describe("User repository unit tests", () => {
  let mockUser: IUser;
  let mockUsername: string;
  let mockId: Types.ObjectId;
  let mockUpdateObject: IUserUpdate;
  let mockUpdatedUser: IUser;
  let functionStub: SinonStub;

  describe(`${getUserByUsername.name}`, () => {
    beforeEach(() => {
      // Reset stubs
      sinon.restore();

      // Stubs
      functionStub = sinon.stub(User, "findOne");

      // Mocks
      mockUser = new User();
      mockUsername = validUserInput.username;
    });

    it("Promise resolves to User object", async () => {
      functionStub.resolves(mockUser);

      const foundUser = await getUserByUsername(mockUsername);

      assert(foundUser instanceof User);
    });

    it("Promise resolves to null -> NotFoundError", async () => {
      functionStub.resolves(null);

      try {
        await getUserByUsername(mockUsername);
      } catch (error) {
        assert(error instanceof NotFoundError);
      }
    });

    it("Promise rejects -> ServerError", async () => {
      functionStub.rejects();

      try {
        await getUserByUsername(mockUsername);
      } catch (error) {
        assert(error instanceof ServerError);
      }
    });
  });

  describe(`${addUser.name}`, () => {
    beforeEach(() => {
      // Reset stubs
      sinon.restore();

      // Stubs
      functionStub = sinon.stub(User.prototype, "save");

      // Mocks
      mockUser = new User(validUserInput);
    });

    it("Promise resolves to User object", async () => {
      functionStub.resolves(mockUser);

      const savedUser = await addUser(mockUser);

      assert(savedUser instanceof User);
    });

    it("Promise rejects -> Error.ValidationError", async () => {
      functionStub.rejects(new Error.ValidationError());

      try {
        await addUser(mockUser);
      } catch (error) {
        assert(error instanceof Error.ValidationError);
      }
    });

    it("Promise rejects -> ServerError", async () => {
      functionStub.rejects();

      try {
        await addUser(mockUser);
      } catch (error) {
        assert(error instanceof ServerError);
      }
    });
  });

  describe(`${updateUser.name}`, () => {
    beforeEach(() => {
      // Reset stubs
      sinon.restore();

      // Stubs
      functionStub = sinon.stub(User, "findByIdAndUpdate");

      // Mocks
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

    it("Promise resolves to null -> NotFoundError", async () => {
      functionStub.resolves(null);

      try {
        await updateUser(mockUpdateObject);
      } catch (error) {
        assert(error instanceof NotFoundError);
      }
    });

    it("Promise rejects -> ServerError", async () => {
      functionStub.rejects();

      try {
        await updateUser(mockUpdateObject);
      } catch (error) {
        assert(error instanceof ServerError);
      }
    });
  });
});
