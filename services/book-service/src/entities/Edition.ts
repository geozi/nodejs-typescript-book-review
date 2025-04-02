/**
 * Edition model entity.
 * @module src/entities
 */
import {
  IsDate,
  IsEnum,
  IsInt,
  IsISBN,
  IsPositive,
  IsString,
  Matches,
  MaxLength,
  Min,
  MinLength,
} from "class-validator";
import { editionFailedValidation } from "messages/validation/editionValidationMessages";
import { editionConstants } from "resources/constants/editionConstants";
import { BookFormat } from "resources/enum/BookFormat";
import { ALPHABETIC_REGEX } from "resources/regexp/validationRegExp";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Book } from "./Book";

@Entity()
export class Edition {
  // Columns

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", unique: true })
  @IsISBN("13", { message: editionFailedValidation.ISBN_INVALID_MESSAGE })
  isbn!: string;

  @Column({ type: "date" })
  @IsDate({ message: editionFailedValidation.PUBLICATION_DATE_INVALID_MESSAGE })
  publicationDate!: Date;

  @Column({ type: "varchar" })
  @IsString({ message: editionFailedValidation.PUBLISHER_NOT_STRING_MESSAGE })
  @MinLength(editionConstants.PUBLISHER_MIN_LENGTH, {
    message: editionFailedValidation.PUBLISHER_BELOW_MIN_LENGTH_MESSAGE,
  })
  @MaxLength(editionConstants.PUBLISHER_MAX_LENGTH, {
    message: editionFailedValidation.PUBLISHER_ABOVE_MAX_LENGTH_MESSAGE,
  })
  publisher!: string;

  @Column({ type: "int" })
  @IsInt({ message: editionFailedValidation.PAGE_COUNT_INVALID_MESSAGE })
  @IsPositive({ message: editionFailedValidation.PAGE_COUNT_NEGATIVE_MESSAGE })
  @Min(editionConstants.MIN_PAGE_COUNT, {
    message: editionFailedValidation.PAGE_COUNT_MINIMUM_MESSAGE,
  })
  pageCount!: number;

  @Column({
    type: "enum",
    enum: BookFormat,
  })
  @IsEnum(BookFormat, {
    message: editionFailedValidation.BOOK_FORMAT_INVALID_MESSAGE,
  })
  bookFormat!: BookFormat;

  @Column({ type: "varchar" })
  @IsString({ message: editionFailedValidation.LANGUAGE_NOT_STRING_MESSAGE })
  @MinLength(editionConstants.LANGUAGE_MIN_LENGTH, {
    message: editionFailedValidation.LANGUAGE_MIN_LENGTH_MESSAGE,
  })
  @Matches(ALPHABETIC_REGEX, {
    message: editionFailedValidation.LANGUAGE_INVALID_MESSAGE,
  })
  bookLanguage!: string;

  // Relations

  @ManyToOne(() => Book, (book) => book.editions, { nullable: false })
  book!: Book;
}
