import { Request } from "express";
import { reqBodyToBook } from "mappers/bookMapper";
import { validBookInputs } from "../../tests/testInputs";
import { validateSync } from "class-validator";
import assert from "assert";
import { Book } from "entities/Book";

describe("Book mapper unit tests", () => {
  let req: Partial<Request>;
  describe(`${reqBodyToBook.name}`, () => {
    describe("Positive scenario", () => {
      it("request has valid inputs", () => {
        req = {
          body: JSON.parse(
            JSON.stringify({
              title: validBookInputs.title,
              genre: validBookInputs.genre,
            })
          ),
        };

        const newBook = reqBodyToBook(req as Request);
        const errors = validateSync(newBook);

        assert(newBook instanceof Book);
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(newBook.title, validBookInputs.title);
        assert.strictEqual(newBook.genre.toString(), validBookInputs.genre);
      });
    });
  });
});
