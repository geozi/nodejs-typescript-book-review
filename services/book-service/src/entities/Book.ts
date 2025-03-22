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
import { Genre } from "enum/Genre";

@Entity()
export class Book {
  // Columns
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", unique: true })
  title!: string;

  @Column({
    type: "enum",
    enum: Genre,
  })
  genre!: Genre;

  // Relations

  @OneToMany(() => Edition, (edition) => edition.book)
  editions!: Edition[];

  @ManyToMany(() => Author)
  @JoinTable()
  authors!: Author[];
}
