import { Author } from "entities/Author";
import { validAuthorInput } from "../testInputs";
import { validateSync } from "class-validator";
import assert from "assert";

describe("Author model entity unit tests", () => {
  let author: Author;
  describe("Positive scenarios", () => {
    beforeEach(() => {
      author = new Author(
        validAuthorInput.firstName,
        validAuthorInput.lastName
      );
    });

    it("author has valid inputs", () => {
      const errors = validateSync(author);

      assert.strictEqual(errors.length, 0);
      assert.strictEqual(author.first_name, validAuthorInput.firstName);
      assert.strictEqual(author.last_name, validAuthorInput.lastName);
    });
  });
  describe("Negative scenarios", () => {
    describe("validation-oriented", () => {
      beforeEach(() => [
        (author = new Author(
          validAuthorInput.firstName,
          validAuthorInput.lastName
        )),
      ]);

      it("first_name is not a string", () => {
        author.first_name = "1";
      });
    });
  });
});
