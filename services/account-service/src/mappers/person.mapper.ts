/**
 * Person mapper.
 * @module src/mappers/person.mapper
 */
import { IPerson } from "interfaces/documents/IPerson";
import { IAddress } from "interfaces/secondary/iAddress.interface";
import { IPersonUpdate } from "interfaces/secondary/iPersonUpdate.interface";
import { IRequest } from "interfaces/secondary/iRequest.interface";
import { Person } from "models/person.model";
import { Types } from "mongoose";

/**
 * Converts an {@link IRequest} object to an {@link IPerson} object.
 *
 * @param {IRequest} req - An HTTP request.
 * @returns {IPerson} An {@link IPerson} object.
 */
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

/**
 * Converts an {@link IRequest} object to an {@link IPersonUpdate} object.
 *
 * @param {IRequest} req - An HTTP request.
 * @returns {IPersonUpdate} An {@link IPersonUpdate} object.
 */
export const reqBodyToPersonUpdate = function (req: IRequest): IPersonUpdate {
  const { id, firstName, lastName, ssn, phoneNumber, address } = req.body;
  const username = req.user.username;

  const personToUpdate: IPersonUpdate = {
    id: new Types.ObjectId(id),
    firstName: firstName,
    lastName: lastName,
    ssn: ssn,
    phoneNumber: phoneNumber,
    username: username,
  };

  let addressToSave: IAddress;
  if (address) {
    const { streetName, residenceNumber, zipCode, city } = address;
    addressToSave = {
      streetName: streetName,
      residenceNumber: residenceNumber,
      zipCode: zipCode,
      city: city,
    };

    personToUpdate.address = addressToSave;
  }

  return personToUpdate;
};
