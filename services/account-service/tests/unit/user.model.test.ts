import { IUser } from "interfaces/iUser.interface";
import { User } from "models/user.model";
import sinon, { SinonStub } from "sinon";
import { validUserInput } from "../../tests/testInputs";
import assert from "assert";
import { Error } from "mongoose";
import { userFailedValidation } from "messages/userValidation.message";

describe("User model unit tests", () => {
  let newUser: IUser;

  describe("Successful validation", () => {
    beforeEach(() => {
      sinon.restore();
      newUser = new User(validUserInput);
    });

    it("has valid inputs", () => {
      sinon.replace(
        User.prototype,
        "validateSync",
        sinon.stub().returns(undefined)
      );

      const mongooseErrors = newUser.validateSync();

      assert.strictEqual(mongooseErrors, undefined);
    });
  });

  describe("Failed validation", () => {
    let validationError: Error.ValidationError;
    let validateSyncStub: SinonStub;

    beforeEach(() => {
      sinon.restore();
      newUser = new User();
      validationError = new Error.ValidationError();
      validateSyncStub = sinon.stub(User.prototype, "validateSync");
    });

    it("username is empty", () => {
      validationError.errors = {
        username: new Error.ValidatorError({
          message: userFailedValidation.USERNAME_REQUIRED_MESSAGE,
          path: "username",
          value: "",
        }),
      };

      validateSyncStub.returns(validationError);
      const mongooseErrors = newUser.validateSync();

      assert.notStrictEqual(mongooseErrors, undefined);
      assert.strictEqual(
        mongooseErrors?.errors.username.message,
        userFailedValidation.USERNAME_REQUIRED_MESSAGE
      );
    });
  });
});
