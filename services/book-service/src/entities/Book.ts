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
import { Genre, genreArray } from "resources/enum/Genre";
import { IsString, IsIn, Length } from "class-validator";
import { bookConstants } from "resources/constants/bookConstants";

@Entity()
export class Book {
  // Columns
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", unique: true })
  @IsString()
  @Length(bookConstants.TITLE_MIN_LENGTH, bookConstants.TITLE_MAX_LENGTH)
  title!: string;

  @Column({
    type: "enum",
    enum: Genre,
  })
  @IsIn([genreArray])
  genre!: Genre;

  // Relations

  @OneToMany(() => Edition, (edition) => edition.book)
  editions!: Edition[];

  @ManyToMany(() => Author)
  @JoinTable()
  authors!: Author[];
}
