import { RoleType } from "resources/enums/roleType.enum";

export const validUserInput = {
  username: "newUser",
  email: "random@mail.com",
  password: "5W]L8t1m4@PcTTO",
  role: RoleType.User,
};

export const invalidUserInputs = {
  TOO_SHORT_USERNAME: "ab",
  TOO_LONG_USERNAME: "thisIsAVeryLongUsernameToTest",
  EMAIL_INVALID_CASES: [
    ["email has no prefix", "@mail.com"],
    ["email has no @", "randommail.com"],
    ["email has no domain name", "random@.com"],
    ["email has no .", "random@mailcom"],
    ["email has no top level domain", "random@mail."],
  ] as [string, string][],
  TOO_SHORT_PASSWORD: "E^e;0=",
  PASSWORD_INVALID_CASES: [
    ["password has no uppercase letters", "!]i&u^^.57h3.,%"],
    ["password has no lowercase letters", "+[Q]D~~A,9CGYZ~"],
    ["password has no numbers", "Q}_MC}mdguOs!Gr"],
    ["password has no special symbols", "EyB0McqoXAOYA1Y"],
  ] as [string, string][],
  ROLE_INVALID: "Executive",
};

export const validPersonInput = {
  firstName: "Sebastian",
  lastName: "Mitchell",
  ssn: "398-26-1557",
  phoneNumber: "678-515-7518",
  address: {
    streetName: "12th Street",
    residenceNumber: "91",
    zipCode: "11551",
    city: "Hempstead",
  },
  username: "puzzlingRange",
};

export const invalidPersonInputs = {
  INVALID_FIRST_NAME: "T1m0thy",
  TOO_SHORT_FIRST_NAME: "T",
  INVALID_LAST_NAME: "J3nk1ns*",
  TOO_SHORT_LAST_NAME: "J",
  INVALID_PHONE_NUMBER: "543*123*",
  INVALID_SSN_CASES: [
    ["ssn is missing the hyphens", "398261557 "],
    ["ssn has an incorrect grouping of digits", "39-826-1557"],
    ["ssn contains a non-numeric character", "398-2A-1557"],
    ["ssn exceeds the required number of digits", "398-26-15578"],
  ] as [string, string][],
  INVALID_PHONE_NUMBER_CASES: [
    ["phoneNumber contains  non-numeric characters", "123-ABC-456"],
    ["phoneNumber starts with a +", "+123-456-789"],
    ["phoneNumber contains consecutive hyphens", "123--456"],
    ["phoneNumber ends with a hyphen", "123-456-789-"],
  ] as [string, string][],
};

export const invalidObjectIdInputs = {
  OBJECT_ID_LENGTH_CASES: [
    ["ObjectId is too short", "67710722913928977"],
    [
      "ObjectId is too long",
      "67710722913928977aa04ea067710722913928977aa04ea0",
    ],
  ] as [string, string][],
  OBJECT_ID_INVALID_CASES: [
    ["ObjectId contains special symbols", "67*db12ed*29a1*ed143e37e"],
    ["ObjectId contains white spaces", "6771 722 13928977aa04ea0"],
    ["ObjectId contains capital letters", "67710722913928977AA04ea0"],
  ] as [string, string][],
};

export const invalidAddressInputs = {
  TOO_SHORT_STREET_NAME: "street",
  NEGATIVE_RESIDENCE_NUMBER: "-1",
  INVALID_RESIDENCE_NUMBER: "1a",
  ZIP_CODE_OUT_OF_LENGTH: "1231352",
  INVALID_ZIP_CODE: "P1234",
  INVALID_CITY: "Imag1nary c1ty",
};
