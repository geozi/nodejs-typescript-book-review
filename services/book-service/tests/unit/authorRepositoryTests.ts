import {
  addAuthor,
  getAuthorById,
  updateAuthor,
} from "repositories/authorRepository";
import sinon, { SinonStub } from "sinon";
import assert from "assert";
import { Author } from "entities/Author";
import { AppDataSource } from "config/dataSource";
import { ServerError } from "errors/serverErrorClass";
import { invalidAuthorInputs, validAuthorInputs } from "../../tests/testInputs";
import { ValidationError } from "class-validator";
import { IAuthorUpdate } from "interfaces/IAuthorUpdate";
import { UpdateResult } from "typeorm";

describe("Author repository unit tests", () => {
  let mockId: number;
  let mockAuthor: Author;
  let findOneByStub: SinonStub;
  let updateStub: SinonStub;
  let saveStub: SinonStub;

  describe(`${getAuthorById.name}`, () => {
    beforeEach(() => {
      // Reset stubs and mocks
      sinon.restore();

      // Stubs
      findOneByStub = sinon.stub(
        AppDataSource.getRepository(Author),
        "findOneBy"
      );

      // Mocks
      mockId = 1;
      mockAuthor = new Author();
      mockAuthor.id = mockId;
    });

    it("Promise resolves to Author object", async () => {
      findOneByStub.resolves(mockAuthor);

      const retrievedAuthor = await getAuthorById(mockId);

      assert.notStrictEqual(retrievedAuthor, null);
      assert(retrievedAuthor instanceof Author);
    });

    it("Promise resolves to null", async () => {
      findOneByStub.resolves(null);

      const retrievedAuthor = await getAuthorById(mockId);

      assert.strictEqual(retrievedAuthor, null);
    });

    it("Promise rejects -> ServerError", async () => {
      findOneByStub.rejects();

      try {
        await getAuthorById(mockId);
      } catch (error) {
        assert(error instanceof ServerError);
      }
    });
  });

  describe(`${addAuthor.name}`, () => {
    beforeEach(() => {
      // Reset stubs and mocks
      sinon.restore();

      // Stubs
      saveStub = sinon.stub(AppDataSource.getRepository(Author), "save");

      // Mocks
      mockAuthor = new Author();
      mockAuthor.first_name = validAuthorInputs.firstName;
      mockAuthor.last_name = validAuthorInputs.lastName;
    });

    it("Promise resolves to Author object", async () => {
      saveStub.resolves(mockAuthor);

      const savedAuthor = await addAuthor(mockAuthor);

      assert(savedAuthor instanceof Author);
      assert.strictEqual(savedAuthor.first_name, mockAuthor.first_name);
      assert.strictEqual(savedAuthor.last_name, mockAuthor.last_name);
    });

    it("Promise rejects -> ValidationError", async () => {
      mockAuthor.first_name = invalidAuthorInputs.NAME_TOO_SHORT;

      try {
        await addAuthor(mockAuthor);
      } catch (error) {
        assert(error instanceof ValidationError);
      }
    });

    it("Promise rejects -> ServerError", async () => {
      saveStub.rejects();

      try {
        await addAuthor(mockAuthor);
      } catch (error) {
        assert(error instanceof ServerError);
      }
    });
  });

  describe(`${updateAuthor.name}`, () => {
    let mockDataObject: IAuthorUpdate;
    let mockUpdateResult: UpdateResult;

    beforeEach(() => {
      // Reset stubs and mocks
      sinon.restore();

      // Stubs
      updateStub = sinon.stub(AppDataSource.getRepository(Author), "update");
      findOneByStub = sinon.stub(
        AppDataSource.getRepository(Author),
        "findOneBy"
      );

      // Mocks
      mockUpdateResult = new UpdateResult();
      mockDataObject = { first_name: validAuthorInputs.firstName };
      mockId = 1;
      mockAuthor = new Author();
      mockAuthor.id = mockId;
      mockAuthor.first_name = validAuthorInputs.firstName;
    });

    it("Promise resolves to Author object", async () => {
      mockUpdateResult.affected = 1;
      updateStub.resolves(mockUpdateResult);
      findOneByStub.resolves(mockAuthor);

      const updatedAuthor = await updateAuthor(mockId, mockDataObject);

      assert(updatedAuthor instanceof Author);
      assert.strictEqual(updatedAuthor.id, mockId);
      assert.strictEqual(updatedAuthor.first_name, mockDataObject.first_name);
    });

    it("Promise resolves to null", async () => {
      mockUpdateResult.affected = 0;
      updateStub.resolves(mockUpdateResult);

      const updatedAuthor = await updateAuthor(mockId, mockDataObject);

      assert.strictEqual(updatedAuthor, null);
    });

    it("Promise rejects -> ServerError", async () => {
      mockUpdateResult.affected = 1;
      updateStub.rejects();

      try {
        await updateAuthor(mockId, mockDataObject);
      } catch (error) {
        assert(error instanceof ServerError);
      }
    });
  });
});
