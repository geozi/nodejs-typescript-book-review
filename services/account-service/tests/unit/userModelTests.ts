import assert from "assert";
import { IUser } from "interfaces/documents/IUser";
import { userFailedValidation } from "messages/validation/userValidationMessages";
import { it } from "mocha";
import { User } from "models/User";
import { Error } from "mongoose";
import sinon, { SinonStub } from "sinon";
import { invalidUserInputs, validUserInput } from "tests/testInputs";

describe("User model unit tests", () => {
  let mockUser: IUser;
  let mockValidationError: Error.ValidationError;
  let validateSyncStub: SinonStub;

  describe("Successful validation", () => {
    beforeEach(() => {
      // Reset stubs
      sinon.restore();

      // Stubs
      validateSyncStub = sinon.stub(User.prototype, "validateSync");

      // Mocks
      mockUser = new User(validUserInput);
    });

    it("has valid inputs", () => {
      validateSyncStub.returns(undefined);

      const mongooseErrors = mockUser.validateSync();

      assert.strictEqual(mongooseErrors, undefined);
    });
  });

  describe("Failed validation", () => {
    beforeEach(() => {
      // Reset stubs
      sinon.restore();

      // Stubs
      validateSyncStub = sinon.stub(User.prototype, "validateSync");

      // Mocks
      mockUser = new User();
      mockValidationError = new Error.ValidationError();
    });

    it("username is empty", () => {
      mockValidationError.errors = {
        username: new Error.ValidatorError({
          message: userFailedValidation.USERNAME_REQUIRED_MESSAGE,
          path: "username",
          value: "",
        }),
      };

      validateSyncStub.returns(mockValidationError);
      const mongooseErrors = mockUser.validateSync();

      assert.notStrictEqual(mongooseErrors, undefined);
      assert.strictEqual(
        mongooseErrors?.errors.username.message,
        userFailedValidation.USERNAME_REQUIRED_MESSAGE
      );
    });

    it("username is too long", () => {
      mockValidationError.errors = {
        username: new Error.ValidatorError({
          message: userFailedValidation.USERNAME_ABOVE_MAX_LENGTH_MESSAGE,
          path: "username",
          value: invalidUserInputs.TOO_LONG_USERNAME,
        }),
      };

      validateSyncStub.returns(mockValidationError);
      const mongooseErrors = mockUser.validateSync();

      assert.notStrictEqual(mongooseErrors, undefined);
      assert.strictEqual(
        mongooseErrors?.errors.username.message,
        userFailedValidation.USERNAME_ABOVE_MAX_LENGTH_MESSAGE
      );
    });

    it("email is empty", () => {
      mockValidationError.errors = {
        email: new Error.ValidatorError({
          message: userFailedValidation.EMAIL_REQUIRED_MESSAGE,
          path: "email",
          value: "",
        }),
      };

      validateSyncStub.returns(mockValidationError);
      const mongooseErrors = mockUser.validateSync();

      assert.notStrictEqual(mongooseErrors, undefined);
      assert.strictEqual(
        mongooseErrors?.errors.email.message,
        userFailedValidation.EMAIL_REQUIRED_MESSAGE
      );
    });

    invalidUserInputs.EMAIL_INVALID_CASES.forEach(
      ([testName, invalidEmail]) => {
        it(testName, () => {
          mockValidationError.errors = {
            email: new Error.ValidatorError({
              message: userFailedValidation.EMAIL_INVALID_MESSAGE,
              path: "email",
              value: invalidEmail,
            }),
          };

          validateSyncStub.returns(mockValidationError);
          const mongooseErrors = mockUser.validateSync();

          assert.notStrictEqual(mongooseErrors, undefined);
          assert.strictEqual(
            mongooseErrors?.errors.email.message,
            userFailedValidation.EMAIL_INVALID_MESSAGE
          );
        });
      }
    );

    it("password is empty", () => {
      mockValidationError.errors = {
        password: new Error.ValidatorError({
          message: userFailedValidation.PASSWORD_REQUIRED_MESSAGE,
          path: "password",
          value: "",
        }),
      };

      validateSyncStub.returns(mockValidationError);
      const mongooseErrors = mockUser.validateSync();

      assert.notStrictEqual(mongooseErrors, undefined);
      assert.strictEqual(
        mongooseErrors?.errors.password.message,
        userFailedValidation.PASSWORD_REQUIRED_MESSAGE
      );
    });

    it("role is empty", () => {
      mockValidationError.errors = {
        role: new Error.ValidatorError({
          message: userFailedValidation.ROLE_REQUIRED_MESSAGE,
          path: "role",
          value: "",
        }),
      };

      validateSyncStub.returns(mockValidationError);
      const mongooseErrors = mockUser.validateSync();

      assert.notStrictEqual(mongooseErrors, undefined);
      assert.strictEqual(
        mongooseErrors?.errors.role.message,
        userFailedValidation.ROLE_REQUIRED_MESSAGE
      );
    });

    it("role is invalid", () => {
      mockValidationError.errors = {
        role: new Error.ValidatorError({
          message: userFailedValidation.ROLE_INVALID_MESSAGE,
          path: "role",
          value: invalidUserInputs.ROLE_INVALID,
        }),
      };

      validateSyncStub.returns(mockValidationError);
      const mongooseErrors = mockUser.validateSync();

      assert.notStrictEqual(mongooseErrors, undefined);
      assert.strictEqual(
        mongooseErrors?.errors.role.message,
        userFailedValidation.ROLE_INVALID_MESSAGE
      );
    });
  });
});
