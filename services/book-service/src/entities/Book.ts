import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Edition } from "./Edition";
import { Author } from "./Author";
import { Genre } from "resources/enum/Genre";
import { IsString, MinLength, MaxLength, IsEnum } from "class-validator";
import { bookConstants } from "resources/constants/bookConstants";
import { bookFailedValidation } from "messages/validation/bookValidationMessages";

@Entity()
export class Book {
  // Columns
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", unique: true })
  @IsString({ message: bookFailedValidation.TITLE_NOT_STRING_MESSAGE })
  @MinLength(bookConstants.TITLE_MIN_LENGTH, {
    message: bookFailedValidation.TITLE_BELOW_MIN_LENGTH_MESSAGE,
  })
  @MaxLength(bookConstants.TITLE_MAX_LENGTH, {
    message: bookFailedValidation.TITLE_ABOVE_MAX_LENGTH_MESSAGE,
  })
  title!: string;

  @Column({
    type: "enum",
    enum: Genre,
  })
  @IsEnum(Genre, { message: bookFailedValidation.GENRE_INVALID_MESSAGE })
  genre!: Genre;

  // Relations

  @OneToMany(() => Edition, (edition) => edition.book)
  editions!: Edition[];

  @ManyToMany(() => Author)
  @JoinTable()
  authors!: Author[];
}
