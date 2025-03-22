import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Author {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar" })
  first_name!: string;

  @Column({ type: "varchar" })
  last_name!: string;
}
