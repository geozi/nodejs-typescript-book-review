import { AppDataSource } from "db/dataSource";
import "reflect-metadata";

async function main() {
  try {
    await AppDataSource.initialize();
    console.log("Connection to database established");
  } catch (error) {
    console.log("Failed to connect to database", error);
  }
}
main();
