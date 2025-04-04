import { AppDataSource } from "db/dataSource";
import express from "express";
import "reflect-metadata";
import { authorRouter } from "routes/authorRoutes";
import { bookAuthorRouter } from "routes/bookAuthorRoutes";
import { bookRouter } from "routes/bookRoutes";
import { editionRouter } from "routes/editionRoutes";
const app = express();
const port = 3001;

async function main() {
  try {
    await AppDataSource.initialize();
    console.log("Connection to database established");
  } catch (error) {
    console.log("Failed to connect to database", error);
  }
}

app.use(express.json());

// Protected routes
app.use("/api/p/books", bookRouter);
app.use("/api/p/authors", authorRouter);
app.use("/api/p/editions", editionRouter);
app.use("/api/p/books&authors", bookAuthorRouter);

app.listen(port, () => {
  console.log(`Server is listening on port: ${port}`);
});

main();
