import { IUser } from "interfaces/documents/iUser.interface";
import { User } from "models/user.model";
import sinon, { SinonStub } from "sinon";
import { invalidUserInputs, validUserInput } from "../../tests/testInputs";
import assert from "assert";
import { Error } from "mongoose";
import { userFailedValidation } from "messages/validation/userValidation.message";

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

    it("username is too long", () => {
      validationError.errors = {
        username: new Error.ValidatorError({
          message: userFailedValidation.USERNAME_ABOVE_MAX_LENGTH_MESSAGE,
          path: "username",
          value: invalidUserInputs.TOO_LONG_USERNAME,
        }),
      };

      validateSyncStub.returns(validationError);
      const mongooseErrors = newUser.validateSync();

      assert.notStrictEqual(mongooseErrors, undefined);
      assert.strictEqual(
        mongooseErrors?.errors.username.message,
        userFailedValidation.USERNAME_ABOVE_MAX_LENGTH_MESSAGE
      );
    });

    it("email is empty", () => {
      validationError.errors = {
        email: new Error.ValidatorError({
          message: userFailedValidation.EMAIL_REQUIRED_MESSAGE,
          path: "email",
          value: "",
        }),
      };

      validateSyncStub.returns(validationError);
      const mongooseErrors = newUser.validateSync();

      assert.notStrictEqual(mongooseErrors, undefined);
      assert.strictEqual(
        mongooseErrors?.errors.email.message,
        userFailedValidation.EMAIL_REQUIRED_MESSAGE
      );
    });

    invalidUserInputs.EMAIL_INVALID_CASES.forEach(
      ([testName, invalidEmail]) => {
        it(testName, () => {
          validationError.errors = {
            email: new Error.ValidatorError({
              message: userFailedValidation.EMAIL_INVALID_MESSAGE,
              path: "email",
              value: invalidEmail,
            }),
          };

          validateSyncStub.returns(validationError);
          const mongooseErrors = newUser.validateSync();

          assert.notStrictEqual(mongooseErrors, undefined);
          assert.strictEqual(
            mongooseErrors?.errors.email.message,
            userFailedValidation.EMAIL_INVALID_MESSAGE
          );
        });
      }
    );

    it("password is empty", () => {
      validationError.errors = {
        password: new Error.ValidatorError({
          message: userFailedValidation.PASSWORD_REQUIRED_MESSAGE,
          path: "password",
          value: "",
        }),
      };

      validateSyncStub.returns(validationError);
      const mongooseErrors = newUser.validateSync();

      assert.notStrictEqual(mongooseErrors, undefined);
      assert.strictEqual(
        mongooseErrors?.errors.password.message,
        userFailedValidation.PASSWORD_REQUIRED_MESSAGE
      );
    });

    it("role is empty", () => {
      validationError.errors = {
        role: new Error.ValidatorError({
          message: userFailedValidation.ROLE_REQUIRED_MESSAGE,
          path: "role",
          value: "",
        }),
      };

      validateSyncStub.returns(validationError);
      const mongooseErrors = newUser.validateSync();

      assert.notStrictEqual(mongooseErrors, undefined);
      assert.strictEqual(
        mongooseErrors?.errors.role.message,
        userFailedValidation.ROLE_REQUIRED_MESSAGE
      );
    });

    it("role is invalid", () => {
      validationError.errors = {
        role: new Error.ValidatorError({
          message: userFailedValidation.ROLE_INVALID_MESSAGE,
          path: "role",
          value: invalidUserInputs.ROLE_INVALID,
        }),
      };

      validateSyncStub.returns(validationError);
      const mongooseErrors = newUser.validateSync();

      assert.notStrictEqual(mongooseErrors, undefined);
      assert.strictEqual(
        mongooseErrors?.errors.role.message,
        userFailedValidation.ROLE_INVALID_MESSAGE
      );
    });
  });
});
