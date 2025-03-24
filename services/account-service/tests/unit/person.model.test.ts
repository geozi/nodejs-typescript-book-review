import { IPerson } from "interfaces/documents/IPerson";
import { Person } from "models/Person";
import sinon, { SinonStub } from "sinon";
import { invalidPersonInputs, validPersonInput } from "../../tests/testInputs";
import assert from "assert";
import { Error } from "mongoose";
import { personFailedValidation } from "messages/validation/personValidationMessages";
import { userFailedValidation } from "messages/validation/userValidationMessages";

describe("Person model unit tests", () => {
  let newPerson: IPerson;

  describe("Successful validation", () => {
    beforeEach(() => {
      sinon.restore();
      newPerson = new Person(validPersonInput);
    });

    it("has valid inputs", () => {
      sinon.replace(
        Person.prototype,
        "validateSync",
        sinon.stub().returns(undefined)
      );

      const mongooseErrors = newPerson.validateSync();

      assert.strictEqual(mongooseErrors, undefined);
    });
  });

  describe("Failed validation", () => {
    let validationError: Error.ValidationError;
    let validateSyncStub: SinonStub;

    beforeEach(() => {
      sinon.restore();
      newPerson = new Person();
      validationError = new Error.ValidationError();
      validateSyncStub = sinon.stub(Person.prototype, "validateSync");
    });

    it("firstName is undefined", () => {
      validationError.errors = {
        firstName: new Error.ValidatorError({
          message: personFailedValidation.FIRST_NAME_REQUIRED_MESSAGE,
          path: "firstName",
          value: "",
        }),
      };

      validateSyncStub.returns(validationError);
      const mongooseErrors = newPerson.validateSync();

      assert.notStrictEqual(mongooseErrors, undefined);
      assert.strictEqual(
        mongooseErrors?.errors.firstName.message,
        personFailedValidation.FIRST_NAME_REQUIRED_MESSAGE
      );
    });

    it("firstName is too short", () => {
      validationError.errors = {
        firstName: new Error.ValidatorError({
          message: personFailedValidation.FIRST_NAME_BELOW_MIN_LENGTH_MESSAGE,
          path: "firstName",
          value: invalidPersonInputs.TOO_SHORT_FIRST_NAME,
        }),
      };

      validateSyncStub.returns(validationError);
      const mongooseErrors = newPerson.validateSync();

      assert.notStrictEqual(mongooseErrors, undefined);
      assert.strictEqual(
        mongooseErrors?.errors.firstName.message,
        personFailedValidation.FIRST_NAME_BELOW_MIN_LENGTH_MESSAGE
      );
    });

    it("firstName is invalid", () => {
      validationError.errors = {
        firstName: new Error.ValidatorError({
          message: personFailedValidation.FIRST_NAME_INVALID_MESSAGE,
          path: "firstName",
          value: invalidPersonInputs.INVALID_FIRST_NAME,
        }),
      };

      validateSyncStub.returns(validationError);
      const mongooseErrors = newPerson.validateSync();

      assert.notStrictEqual(mongooseErrors, undefined);
      assert.strictEqual(
        mongooseErrors?.errors.firstName.message,
        personFailedValidation.FIRST_NAME_INVALID_MESSAGE
      );
    });

    it("lastName is undefined", () => {
      validationError.errors = {
        lastName: new Error.ValidatorError({
          message: personFailedValidation.LAST_NAME_REQUIRED_MESSAGE,
          path: "lastName",
          value: "",
        }),
      };

      validateSyncStub.returns(validationError);
      const mongooseErrors = newPerson.validateSync();

      assert.notStrictEqual(mongooseErrors, undefined);
      assert.strictEqual(
        mongooseErrors?.errors.lastName.message,
        personFailedValidation.LAST_NAME_REQUIRED_MESSAGE
      );
    });

    it("lastName is too short", () => {
      validationError.errors = {
        lastName: new Error.ValidatorError({
          message: personFailedValidation.LAST_NAME_BELOW_MIN_LENGTH_MESSAGE,
          path: "lastName",
          value: invalidPersonInputs.TOO_SHORT_LAST_NAME,
        }),
      };

      validateSyncStub.returns(validationError);
      const mongooseErrors = newPerson.validateSync();

      assert.notStrictEqual(mongooseErrors, undefined);
      assert.strictEqual(
        mongooseErrors?.errors.lastName.message,
        personFailedValidation.LAST_NAME_BELOW_MIN_LENGTH_MESSAGE
      );
    });

    it("lastName is invalid", () => {
      validationError.errors = {
        lastName: new Error.ValidatorError({
          message: personFailedValidation.LAST_NAME_INVALID_MESSAGE,
          path: "lastName",
          value: invalidPersonInputs.INVALID_LAST_NAME,
        }),
      };

      validateSyncStub.returns(validationError);
      const mongooseErrors = newPerson.validateSync();

      assert.notStrictEqual(mongooseErrors, undefined);
      assert.strictEqual(
        mongooseErrors?.errors.lastName.message,
        personFailedValidation.LAST_NAME_INVALID_MESSAGE
      );
    });

    it("ssn is undefined", () => {
      validationError.errors = {
        ssn: new Error.ValidatorError({
          message: personFailedValidation.SSN_REQUIRED_MESSAGE,
          path: "ssn",
          value: "",
        }),
      };

      validateSyncStub.returns(validationError);
      const mongooseErrors = newPerson.validateSync();

      assert.notStrictEqual(mongooseErrors, undefined);
      assert.strictEqual(
        mongooseErrors?.errors.ssn.message,
        personFailedValidation.SSN_REQUIRED_MESSAGE
      );
    });

    invalidPersonInputs.INVALID_SSN_CASES.forEach(([testName, invalidSSN]) => {
      it(testName, () => {
        validationError.errors = {
          ssn: new Error.ValidatorError({
            message: personFailedValidation.SSN_INVALID_MESSAGE,
            path: "ssn",
            value: invalidSSN,
          }),
        };

        validateSyncStub.returns(validationError);
        const mongooseErrors = newPerson.validateSync();

        assert.notStrictEqual(mongooseErrors, undefined);
        assert.strictEqual(
          mongooseErrors?.errors.ssn.message,
          personFailedValidation.SSN_INVALID_MESSAGE
        );
      });
    });

    it("phoneNumber is undefined", () => {
      validationError.errors = {
        phoneNumber: new Error.ValidatorError({
          message: personFailedValidation.PHONE_NUMBER_REQUIRED_MESSAGE,
          path: "phoneNumber",
          value: "",
        }),
      };

      validateSyncStub.returns(validationError);
      const mongooseErrors = newPerson.validateSync();

      assert.notStrictEqual(mongooseErrors, undefined);
      assert.strictEqual(
        mongooseErrors?.errors.phoneNumber.message,
        personFailedValidation.PHONE_NUMBER_REQUIRED_MESSAGE
      );
    });

    invalidPersonInputs.INVALID_PHONE_NUMBER_CASES.forEach(
      ([testName, invalidPhoneNumber]) => {
        it(testName, () => {
          validationError.errors = {
            phoneNumber: new Error.ValidatorError({
              message: personFailedValidation.PHONE_NUMBER_INVALID_MESSAGE,
              path: "phoneNumber",
              value: invalidPhoneNumber,
            }),
          };

          validateSyncStub.returns(validationError);
          const mongooseErrors = newPerson.validateSync();

          assert.notStrictEqual(mongooseErrors, undefined);
          assert.strictEqual(
            mongooseErrors?.errors.phoneNumber.message,
            personFailedValidation.PHONE_NUMBER_INVALID_MESSAGE
          );
        });
      }
    );

    it("address is undefined", () => {
      validationError.errors = {
        address: new Error.ValidatorError({
          message: personFailedValidation.ADDRESS_REQUIRED_MESSAGE,
          path: "address",
          value: "",
        }),
      };

      validateSyncStub.returns(validationError);
      const mongooseErrors = newPerson.validateSync();

      assert.notStrictEqual(mongooseErrors, undefined);
      assert.strictEqual(
        mongooseErrors?.errors.address.message,
        personFailedValidation.ADDRESS_REQUIRED_MESSAGE
      );
    });

    it("username is undefined", () => {
      validationError.errors = {
        username: new Error.ValidatorError({
          message: userFailedValidation.USERNAME_REQUIRED_MESSAGE,
          path: "username",
          value: "",
        }),
      };

      validateSyncStub.returns(validationError);
      const mongooseErrors = newPerson.validateSync();

      assert.notStrictEqual(mongooseErrors, undefined);
      assert.strictEqual(
        mongooseErrors?.errors.username.message,
        userFailedValidation.USERNAME_REQUIRED_MESSAGE
      );
    });
  });
});
