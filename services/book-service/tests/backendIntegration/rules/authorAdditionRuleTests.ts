import { Request, Response } from "express";
import { SinonSpy, SinonStub } from "sinon";

describe("Author addition rules integration tests", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: SinonSpy;
  let statusStub: SinonStub;
  let jsonSpy: SinonSpy;
});
