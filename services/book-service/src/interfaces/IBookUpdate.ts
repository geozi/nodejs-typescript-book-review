import { Author } from "entities/Author";
import { Edition } from "entities/Edition";
import { Genre } from "resources/enum/Genre";

export interface IBookUpdate {
  title?: string;
  genre?: Genre;
  authors?: Author[];
  editions?: Edition[];
}
