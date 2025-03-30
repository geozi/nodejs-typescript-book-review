import { AppDataSource } from "config/dataSource";
import { Edition } from "entities/Edition";
import { Request, Response } from "express";
import sinon, { SinonSpy, SinonStub } from "sinon";
import { validEditionInputs } from "tests/testInputs";

describe("Edition addition integration tests", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusStub: SinonStub;
  let jsonSpy: SinonSpy;
  let setHeaderStub: SinonStub;
  let saveStub: SinonStub;
  let mockEdition: Edition;

  describe("Positive scenarios", () => {
    beforeEach(() => {
      // Reset stubs and mocks
      sinon.restore();

      // Stubs
      saveStub = sinon.stub(AppDataSource.getRepository(Edition), "save");

      res = {
        setHeader: sinon.stub().callsFake(() => res) as unknown as SinonStub,
        status: sinon.stub().callsFake(() => res) as unknown as SinonStub,
        json: sinon.spy(),
      };

      req = {
        body: JSON.parse(
          JSON.stringify({
            isbn: validEditionInputs.isbn,
            publicationDate: validEditionInputs.publication_date,
            publisher: validEditionInputs.publisher,
            pageCount: validEditionInputs.page_count,
            bookFormat: validEditionInputs.book_format,
            bookLanguage: validEditionInputs.book_language,
            book: "1",
          })
        ),
      };

      // Mocks
      mockEdition = new Edition();
    });
  });
});
