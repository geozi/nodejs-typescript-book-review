import { IAddress } from "interfaces/secondary/iAddress.interface";
import { IRequest } from "interfaces/secondary/iRequest.interface";
import { Person } from "models/person.model";

export const reqBodyToPerson = function (req: IRequest) {
  const { firstName, lastName, ssn, phoneNumber, address } = req.body;
  const { streetName, residenceNumber, zipCode, city } = address;
  const username = req.user.username;

  const newPerson = new Person({
    firstName: firstName,
    lastName: lastName,
    ssn: ssn,
    phoneNumber: phoneNumber,
    username: username,
  });

  const addressToSave: IAddress = {
    streetName: streetName,
    residenceNumber: residenceNumber,
    zipCode: zipCode,
    city: city,
  };

  newPerson.address = addressToSave;

  return newPerson;
};
