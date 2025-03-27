import { IsString, Matches, MinLength } from "class-validator";
import { authorFailedValidation } from "messages/validation/authorValidationMessages";
import { authorConstants } from "resources/constants/authorConstants";
import { ALPHABETIC_REGEX } from "resources/regexp/validationRegExp";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Book } from "./Book";

@Entity()
export class Author {
  // Columns
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar" })
  @IsString({ message: authorFailedValidation.FIRST_NAME_NOT_STRING_MESSAGE })
  @MinLength(authorConstants.NAME_MIN_LENGTH, {
    message: authorFailedValidation.FIRST_NAME_BELOW_MIN_LENGTH_MESSAGE,
  })
  @Matches(ALPHABETIC_REGEX, {
    message: authorFailedValidation.FIRST_NAME_INVALID_MESSAGE,
  })
  first_name!: string;

  @Column({ type: "varchar" })
  @IsString({ message: authorFailedValidation.LAST_NAME_NOT_STRING_MESSAGE })
  @MinLength(authorConstants.NAME_MIN_LENGTH, {
    message: authorFailedValidation.LAST_NAME_BELOW_MIN_LENGTH_MESSAGE,
  })
  @Matches(ALPHABETIC_REGEX, {
    message: authorFailedValidation.LAST_NAME_INVALID_MESSAGE,
  })
  last_name!: string;

  // Relations
  @ManyToMany(() => Book, (book) => book.authors)
  books!: Book[];
}
