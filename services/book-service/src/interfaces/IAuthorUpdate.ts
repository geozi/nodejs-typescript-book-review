import { Book } from "entities/Book";

export interface IAuthorUpdate {
  first_name?: string;
  last_name?: string;
  books?: Book[];
}
