import { Request } from "express";
import { Genre, genreArray } from "resources/enum/Genre";

export const reqBodyToId = (req: Request): number => {
  const { id } = req.body;
  return Number(id).valueOf();
};

export const reqBodyToGenre = (req: Request) => {
  const { genre } = req.body;

  let genreAsEnum = Genre.FICTION;
  for (let i = 1; i < genreArray.length; i++) {
    if (genreArray[i].toString() === genre) {
      genreAsEnum = genreArray[i];
      break;
    }
  }

  return genreAsEnum;
};
