import { IsString, Matches, MinLength } from "class-validator";
import { authorFailedValidation } from "messages/authorValidationMessages";
import { authorConstants } from "resources/constants/authorConstants";
import { ALPHABETIC_REGEX } from "resources/regexp/validationRegExp";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Author {
  // Columns
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar" })
  @IsString()
  @MinLength(authorConstants.NAME_MIN_LENGTH, {
    message: authorFailedValidation.FIRST_NAME_BELOW_MIN_LENGTH_MESSAGE,
  })
  @Matches(ALPHABETIC_REGEX, {
    message: authorFailedValidation.FIRST_NAME_INVALID,
  })
  first_name: string;

  @Column({ type: "varchar" })
  @IsString()
  @MinLength(authorConstants.NAME_MIN_LENGTH, {
    message: authorFailedValidation.LAST_NAME_BELOW_MIN_LENGTH_MESSAGE,
  })
  @Matches(ALPHABETIC_REGEX, {
    message: authorFailedValidation.LAST_NAME_INVALID,
  })
  last_name: string;

  // Constructor

  constructor(firstName?: string, lastName?: string) {
    this.first_name = firstName || "";
    this.last_name = lastName || "";
  }
}
