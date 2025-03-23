import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Book } from "./Book";
import { BookFormat } from "resources/enum/BookFormat";
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
import { editionConstants } from "resources/constants/editionConstants";
import { editionFailedValidation } from "messages/editionValidationMessages";
import { ALPHABETIC_REGEX } from "resources/regexp/validationRegExp";

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
  publication_date!: Date;

  @Column({ type: "varchar" })
  @IsString()
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
  page_count!: number;

  @Column({
    type: "enum",
    enum: BookFormat,
  })
  @IsEnum(BookFormat, {
    message: editionFailedValidation.BOOK_FORMAT_INVALID_MESSAGE,
  })
  book_format!: BookFormat;

  @Column({ type: "varchar" })
  @IsString()
  @MinLength(editionConstants.LANGUAGE_MIN_LENGTH, {
    message: editionFailedValidation.LANGUAGE_MIN_LENGTH_MESSAGE,
  })
  @Matches(ALPHABETIC_REGEX, {
    message: editionFailedValidation.LANGUAGE_INVALID,
  })
  book_language!: string;

  // Relations

  @ManyToOne(() => Book, (book) => book.editions, { nullable: false })
  book!: Book;
}
