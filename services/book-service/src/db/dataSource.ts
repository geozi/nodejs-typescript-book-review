import "reflect-metadata";
import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
import { Book } from "entities/Book";
import { Author } from "entities/Author";
import { Edition } from "entities/Edition";
dotenv.config();

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: process.env.DB_USER as string,
  password: process.env.DB_KEY as string,
  database: process.env.DB_NAME as string,
  synchronize: true,
  logging: false,
  entities: [Book, Author, Edition],
  migrations: [],
  subscribers: [],
});
