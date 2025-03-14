import { IPerson } from "interfaces/documents/iPerson.interface";
import { IPersonUpdate } from "interfaces/secondary/iPersonUpdate.interface";
import { appLogger } from "../../logs/logger.config";
import { Person } from "models/person.model";

export const addPerson = async (newPerson: IPerson): Promise<IPerson> => {
  const savedPerson = await newPerson.save();

  appLogger.info(`Person repository: ${addPerson.name} called successfully`);

  return savedPerson;
};

export const updatePerson = async (
  updateDataObject: IPersonUpdate
): Promise<IPerson | null> => {
  const { id, firstName, lastName, ssn, phoneNumber, address, username } = {
    ...updateDataObject,
  };

  const personToUpdate = {
    firstName: firstName,
    lastName: lastName,
    ssn: ssn,
    phoneNumber: phoneNumber,
    address: address,
    username: username,
  };

  const updatedPerson = await Person.findByIdAndUpdate(id, personToUpdate, {
    new: true,
    runValidators: true,
    context: "query",
  });

  appLogger.info(`Person repository: ${updatePerson.name} called successfully`);

  return updatedPerson;
};

export const getPersonByUsername = async (
  username: string
): Promise<IPerson | null> => {
  const foundPerson = await Person.findOne({ username: username });

  appLogger.info(
    `Person repository: ${getPersonByUsername.name} called successfully`
  );

  return foundPerson;
};
