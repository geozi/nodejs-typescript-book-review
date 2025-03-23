import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Book } from "./Book";
import { BookFormat, bookFormatArray } from "resources/enum/BookFormat";
import {
  IsDate,
  IsIn,
  IsInt,
  IsISBN,
  IsPositive,
  IsString,
  Length,
  Min,
} from "class-validator";
import { editionConstants } from "resources/constants/editionConstants";

@Entity()
export class Edition {
  // Columns

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", unique: true })
  @IsISBN("13")
  isbn!: string;

  @Column({ type: "date" })
  @IsDate()
  publication_date!: Date;

  @Column({ type: "varchar" })
  @IsString()
  @Length(
    editionConstants.PUBLISHER_MIN_LENGTH,
    editionConstants.PUBLISHER_MAX_LENGTH
  )
  publisher!: string;

  @Column({ type: "int" })
  @IsInt()
  @IsPositive()
  @Min(editionConstants.MIN_PAGE_COUNT)
  page_count!: number;

  @Column({
    type: "enum",
    enum: BookFormat,
  })
  @IsIn([bookFormatArray])
  book_format!: BookFormat;

  @Column({ type: "varchar" })
  @IsString()
  @Length(editionConstants.LANGUAGE_MIN_LENGTH)
  book_language!: string;

  // Relations

  @ManyToOne(() => Book, (book) => book.editions, { nullable: false })
  book!: Book;
}
