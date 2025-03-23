import { Genre } from "resources/enum/Genre";

export interface IBookUpdate {
  title?: string;
  genre?: Genre;
}
