import { IPerson } from "interfaces/documents/iPerson.interface";
import { IAddress } from "interfaces/secondary/iAddress.interface";
import { IPersonUpdate } from "interfaces/secondary/iPersonUpdate.interface";
import { IRequest } from "interfaces/secondary/iRequest.interface";
import { Person } from "models/person.model";
import { Types } from "mongoose";

export const reqBodyToPerson = function (req: IRequest): IPerson {
  const { firstName, lastName, ssn, phoneNumber, address } = req.body;
  const { streetName, residenceNumber, zipCode, city } = address;
  const username = req.user.username;

  const addressToSave: IAddress = {
    streetName: streetName,
    residenceNumber: residenceNumber,
    zipCode: zipCode,
    city: city,
  };

  const newPerson = new Person({
    firstName: firstName,
    lastName: lastName,
    ssn: ssn,
    phoneNumber: phoneNumber,
    address: addressToSave,
    username: username,
  });

  return newPerson;
};

export const reqBodyToPersonUpdate = function (req: IRequest): IPersonUpdate {
  const { id, firstName, lastName, ssn, phoneNumber, address } = req.body;
  const { streetName, residenceNumber, zipCode, city } = address;
  const username = req.user.username;

  const addressToSave: IAddress = {
    streetName: streetName,
    residenceNumber: residenceNumber,
    zipCode: zipCode,
    city: city,
  };

  const personToUpdate: IPersonUpdate = {
    id: new Types.ObjectId(id),
    firstName: firstName,
    lastName: lastName,
    ssn: ssn,
    phoneNumber: phoneNumber,
    address: addressToSave,
    username: username,
  };

  return personToUpdate;
};
