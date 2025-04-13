import assert from "assert";
import { IPerson } from "interfaces/documents/IPerson";
import { personFailedValidation } from "messages/validation/personValidationMessages";
import { userFailedValidation } from "messages/validation/userValidationMessages";
import { Person } from "models/Person";
import { Error } from "mongoose";
import sinon, { SinonStub } from "sinon";
import { invalidPersonInputs, validPersonInput } from "tests/testInputs";

describe("Person model unit tests", () => {
  let mockPerson: IPerson;
  let mockValidationError: Error.ValidationError;
  let validateSyncStub: SinonStub;

  describe("Successful validation", () => {
    beforeEach(() => {
      // Restore stubs
      sinon.restore();

      // Stubs
      validateSyncStub = sinon.stub(Person.prototype, "validateSync");

      // Mocks
      mockPerson = new Person(validPersonInput);
    });

    it("has valid inputs", () => {
      validateSyncStub.returns(undefined);

      const mongooseErrors = mockPerson.validateSync();

      assert.strictEqual(mongooseErrors, undefined);
    });
  });

  describe("Failed validation", () => {
    beforeEach(() => {
      // Reset stubs
      sinon.restore();

      // Stubs
      validateSyncStub = sinon.stub(Person.prototype, "validateSync");

      // Mocks
      mockValidationError = new Error.ValidationError();
      mockPerson = new Person();
    });

    it("firstName is undefined", () => {
      mockValidationError.errors = {
        firstName: new Error.ValidatorError({
          message: personFailedValidation.FIRST_NAME_REQUIRED_MESSAGE,
          path: "firstName",
          value: "",
        }),
      };

      validateSyncStub.returns(mockValidationError);
      const mongooseErrors = mockPerson.validateSync();

      assert.notStrictEqual(mongooseErrors, undefined);
      assert.strictEqual(
        mongooseErrors?.errors.firstName.message,
        personFailedValidation.FIRST_NAME_REQUIRED_MESSAGE
      );
    });

    it("firstName is too short", () => {
      mockValidationError.errors = {
        firstName: new Error.ValidatorError({
          message: personFailedValidation.FIRST_NAME_BELOW_MIN_LENGTH_MESSAGE,
          path: "firstName",
          value: invalidPersonInputs.TOO_SHORT_FIRST_NAME,
        }),
      };

      validateSyncStub.returns(mockValidationError);
      const mongooseErrors = mockPerson.validateSync();

      assert.notStrictEqual(mongooseErrors, undefined);
      assert.strictEqual(
        mongooseErrors?.errors.firstName.message,
        personFailedValidation.FIRST_NAME_BELOW_MIN_LENGTH_MESSAGE
      );
    });

    it("firstName is invalid", () => {
      mockValidationError.errors = {
        firstName: new Error.ValidatorError({
          message: personFailedValidation.FIRST_NAME_INVALID_MESSAGE,
          path: "firstName",
          value: invalidPersonInputs.INVALID_FIRST_NAME,
        }),
      };

      validateSyncStub.returns(mockValidationError);
      const mongooseErrors = mockPerson.validateSync();

      assert.notStrictEqual(mongooseErrors, undefined);
      assert.strictEqual(
        mongooseErrors?.errors.firstName.message,
        personFailedValidation.FIRST_NAME_INVALID_MESSAGE
      );
    });

    it("lastName is undefined", () => {
      mockValidationError.errors = {
        lastName: new Error.ValidatorError({
          message: personFailedValidation.LAST_NAME_REQUIRED_MESSAGE,
          path: "lastName",
          value: "",
        }),
      };

      validateSyncStub.returns(mockValidationError);
      const mongooseErrors = mockPerson.validateSync();

      assert.notStrictEqual(mongooseErrors, undefined);
      assert.strictEqual(
        mongooseErrors?.errors.lastName.message,
        personFailedValidation.LAST_NAME_REQUIRED_MESSAGE
      );
    });

    it("lastName is too short", () => {
      mockValidationError.errors = {
        lastName: new Error.ValidatorError({
          message: personFailedValidation.LAST_NAME_BELOW_MIN_LENGTH_MESSAGE,
          path: "lastName",
          value: invalidPersonInputs.TOO_SHORT_LAST_NAME,
        }),
      };

      validateSyncStub.returns(mockValidationError);
      const mongooseErrors = mockPerson.validateSync();

      assert.notStrictEqual(mongooseErrors, undefined);
      assert.strictEqual(
        mongooseErrors?.errors.lastName.message,
        personFailedValidation.LAST_NAME_BELOW_MIN_LENGTH_MESSAGE
      );
    });

    it("lastName is invalid", () => {
      mockValidationError.errors = {
        lastName: new Error.ValidatorError({
          message: personFailedValidation.LAST_NAME_INVALID_MESSAGE,
          path: "lastName",
          value: invalidPersonInputs.INVALID_LAST_NAME,
        }),
      };

      validateSyncStub.returns(mockValidationError);
      const mongooseErrors = mockPerson.validateSync();

      assert.notStrictEqual(mongooseErrors, undefined);
      assert.strictEqual(
        mongooseErrors?.errors.lastName.message,
        personFailedValidation.LAST_NAME_INVALID_MESSAGE
      );
    });

    it("ssn is undefined", () => {
      mockValidationError.errors = {
        ssn: new Error.ValidatorError({
          message: personFailedValidation.SSN_REQUIRED_MESSAGE,
          path: "ssn",
          value: "",
        }),
      };

      validateSyncStub.returns(mockValidationError);
      const mongooseErrors = mockPerson.validateSync();

      assert.notStrictEqual(mongooseErrors, undefined);
      assert.strictEqual(
        mongooseErrors?.errors.ssn.message,
        personFailedValidation.SSN_REQUIRED_MESSAGE
      );
    });

    invalidPersonInputs.INVALID_SSN_CASES.forEach(([testName, invalidSSN]) => {
      it(testName, () => {
        mockValidationError.errors = {
          ssn: new Error.ValidatorError({
            message: personFailedValidation.SSN_INVALID_MESSAGE,
            path: "ssn",
            value: invalidSSN,
          }),
        };

        validateSyncStub.returns(mockValidationError);
        const mongooseErrors = mockPerson.validateSync();

        assert.notStrictEqual(mongooseErrors, undefined);
        assert.strictEqual(
          mongooseErrors?.errors.ssn.message,
          personFailedValidation.SSN_INVALID_MESSAGE
        );
      });
    });

    it("phoneNumber is undefined", () => {
      mockValidationError.errors = {
        phoneNumber: new Error.ValidatorError({
          message: personFailedValidation.PHONE_NUMBER_REQUIRED_MESSAGE,
          path: "phoneNumber",
          value: "",
        }),
      };

      validateSyncStub.returns(mockValidationError);
      const mongooseErrors = mockPerson.validateSync();

      assert.notStrictEqual(mongooseErrors, undefined);
      assert.strictEqual(
        mongooseErrors?.errors.phoneNumber.message,
        personFailedValidation.PHONE_NUMBER_REQUIRED_MESSAGE
      );
    });

    invalidPersonInputs.INVALID_PHONE_NUMBER_CASES.forEach(
      ([testName, invalidPhoneNumber]) => {
        it(testName, () => {
          mockValidationError.errors = {
            phoneNumber: new Error.ValidatorError({
              message: personFailedValidation.PHONE_NUMBER_INVALID_MESSAGE,
              path: "phoneNumber",
              value: invalidPhoneNumber,
            }),
          };

          validateSyncStub.returns(mockValidationError);
          const mongooseErrors = mockPerson.validateSync();

          assert.notStrictEqual(mongooseErrors, undefined);
          assert.strictEqual(
            mongooseErrors?.errors.phoneNumber.message,
            personFailedValidation.PHONE_NUMBER_INVALID_MESSAGE
          );
        });
      }
    );

    it("address is undefined", () => {
      mockValidationError.errors = {
        address: new Error.ValidatorError({
          message: personFailedValidation.ADDRESS_REQUIRED_MESSAGE,
          path: "address",
          value: "",
        }),
      };

      validateSyncStub.returns(mockValidationError);
      const mongooseErrors = mockPerson.validateSync();

      assert.notStrictEqual(mongooseErrors, undefined);
      assert.strictEqual(
        mongooseErrors?.errors.address.message,
        personFailedValidation.ADDRESS_REQUIRED_MESSAGE
      );
    });

    it("username is undefined", () => {
      mockValidationError.errors = {
        username: new Error.ValidatorError({
          message: userFailedValidation.USERNAME_REQUIRED_MESSAGE,
          path: "username",
          value: "",
        }),
      };

      validateSyncStub.returns(mockValidationError);
      const mongooseErrors = mockPerson.validateSync();

      assert.notStrictEqual(mongooseErrors, undefined);
      assert.strictEqual(
        mongooseErrors?.errors.username.message,
        userFailedValidation.USERNAME_REQUIRED_MESSAGE
      );
    });
  });
});
