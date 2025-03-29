import { Book } from "entities/Book";
import { Request, Response } from "express";
import { SinonSpy, SinonStub } from "sinon";

describe("Book retrieval by title integration tests", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusStub: SinonStub;
  let jsonSpy: SinonSpy;
  let setHeaderStub: SinonStub;
  let findOneByStub: SinonStub;
  let mockBook: Book;
});
