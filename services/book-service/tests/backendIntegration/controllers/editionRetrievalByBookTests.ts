import assert from "assert";
import { callEditionRetrievalByBook } from "controllers/editionController";
import { AppDataSource } from "db/dataSource";
import { Book } from "entities/Book";
import { Edition } from "entities/Edition";
import { Request, Response } from "express";
import { commonResponseMessages } from "messages/response/commonResponseMessages";
import { editionControllerResponseMessages } from "messages/response/editionControllerResponseMessages";
import { apiVersionNumbers } from "resources/codes/apiVersionNumbers";
import { httpCodes } from "resources/codes/responseStatusCodes";
import sinon, { SinonSpy, SinonStub } from "sinon";

describe("Edition retrieval by book integration tests", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusStub: SinonStub;
  let jsonSpy: SinonSpy;
  let setHeaderStub: SinonStub;
  let findByStub: SinonStub;
  let findOneByStub: SinonStub;
  let mockEditions: Edition[];
  let mockEdition1: Edition;
  let mockEdition2: Edition;
  let mockBook: Book;
  let mockId: number;

  describe("Positive scenarios", () => {
    beforeEach(() => {
      // Reset stubs, spies, and mocks
      sinon.restore();

      // Stubs and spies
      findByStub = sinon.stub(AppDataSource.getRepository(Edition), "findBy");
      findOneByStub = sinon.stub(
        AppDataSource.getRepository(Book),
        "findOneBy"
      );
      res = {
        setHeader: sinon.stub().callsFake(() => res) as unknown as SinonStub,
        status: sinon.stub().callsFake(() => res) as unknown as SinonStub,
        json: sinon.spy(),
      };

      // Mocks
      mockId = 1;
      mockBook = new Book();
      mockBook.id = Number(mockId).valueOf();
      mockEdition1 = new Edition();
      mockEdition1.book = mockBook;
      mockEdition2 = new Edition();
      mockEdition2.book = mockBook;
      mockEditions = [mockEdition1, mockEdition2];
    });

    it("ok (200)", async () => {
      findOneByStub.resolves(mockBook);
      findByStub.resolves(mockEditions);

      req = {
        body: JSON.parse(
          JSON.stringify({
            book: { id: mockId },
          })
        ),
      };

      await callEditionRetrievalByBook(req as Request, res as Response);

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;
      setHeaderStub = res.setHeader as SinonStub;

      assert.strictEqual(
        setHeaderStub.calledWith(
          "x-api-version",
          apiVersionNumbers.VERSION_1_0
        ),
        true
      );
      assert.strictEqual(statusStub.calledWith(httpCodes.OK), true);
      assert.strictEqual(
        jsonSpy.calledWith({
          message: editionControllerResponseMessages.EDITION_S_RETRIEVED,
          data: mockEditions,
        }),
        true
      );
    });
  });

  describe("Negative scenarios", () => {
    beforeEach(() => {
      // Reset stubs, spies, and mocks
      sinon.restore();

      // Stubs and spies
      findByStub = sinon.stub(AppDataSource.getRepository(Edition), "findBy");
      findOneByStub = sinon.stub(
        AppDataSource.getRepository(Book),
        "findOneBy"
      );
      res = {
        status: sinon.stub().callsFake(() => res) as unknown as SinonStub,
        json: sinon.spy(),
      };

      // Mocks
      mockId = 1;
      mockBook = new Book();

      req = {
        body: JSON.parse(
          JSON.stringify({
            book: { id: mockId },
          })
        ),
      };
    });

    it("server error (500) -> findOneBy rejects", async () => {
      findOneByStub.rejects();

      await callEditionRetrievalByBook(req as Request, res as Response);

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(
        statusStub.calledWith(httpCodes.INTERNAL_SERVER_ERROR),
        true
      );
      assert.strictEqual(
        jsonSpy.calledWith({
          message: commonResponseMessages.SERVER_ERROR_MESSAGE,
        }),
        true
      );
    });

    it("server error (500) -> findBy rejects", async () => {
      findOneByStub.resolves(mockBook);
      findByStub.rejects();

      await callEditionRetrievalByBook(req as Request, res as Response);

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(
        statusStub.calledWith(httpCodes.INTERNAL_SERVER_ERROR),
        true
      );
      assert.strictEqual(
        jsonSpy.calledWith({
          message: commonResponseMessages.SERVER_ERROR_MESSAGE,
        }),
        true
      );
    });

    it("not found (404)", async () => {
      findOneByStub.resolves(mockBook);
      findByStub.resolves([]);

      await callEditionRetrievalByBook(req as Request, res as Response);

      statusStub = res.status as SinonStub;
      jsonSpy = res.json as SinonSpy;

      assert.strictEqual(statusStub.calledWith(httpCodes.NOT_FOUND), true);
      assert.strictEqual(
        jsonSpy.calledWith({
          message: editionControllerResponseMessages.EDITION_S_NOT_FOUND,
        }),
        true
      );
    });
  });
});
