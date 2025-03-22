import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Book } from "./Book";
import { BookFormat } from "enum/BookFormat";
@Entity()
export class Edition {
  // Columns

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", unique: true })
  isbn!: string;

  @Column({ type: "date" })
  publication_date!: Date;

  @Column({ type: "varchar" })
  publisher!: string;

  @Column({ type: "int" })
  page_count!: number;

  @Column({
    type: "enum",
    enum: BookFormat,
  })
  book_format!: BookFormat;

  @Column({ type: "varchar" })
  book_language!: string;

  // Relations

  @ManyToOne(() => Book, (book) => book.editions, { nullable: false })
  book!: Book;
}
