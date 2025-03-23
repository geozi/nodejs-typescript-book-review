import { IsString, MinLength } from "class-validator";
import { authorFailedValidation } from "messages/authorValidationMessages";
import { authorConstants } from "resources/constants/authorConstants";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Author {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar" })
  @IsString()
  @MinLength(authorConstants.NAME_MIN_LENGTH, {
    message: authorFailedValidation.FIRST_NAME_BELOW_MIN_LENGTH_MESSAGE,
  })
  first_name!: string;

  @Column({ type: "varchar" })
  @IsString()
  @MinLength(authorConstants.NAME_MIN_LENGTH, {
    message: authorFailedValidation.LAST_NAME_BELOW_MIN_LENGTH_MESSAGE,
  })
  last_name!: string;
}
