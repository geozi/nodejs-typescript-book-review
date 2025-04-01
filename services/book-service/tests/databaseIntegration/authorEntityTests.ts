import assert from "assert";
import { callAuthorAddition } from "controllers/authorController";
import { AppDataSource } from "db/dataSource";
import { Author } from "entities/Author";
import { Request, Response } from "express";
import { apiVersionNumbers } from "resources/codes/apiVersionNumbers";
import { httpCodes } from "resources/codes/responseStatusCodes";
import sinon, { SinonStub } from "sinon";
import { validAuthorInputs } from "tests/testInputs";

describe("Author entity integration tests", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let setHeaderStub: SinonStub;
  let statusStub: SinonStub;

  before(async () => {
    await AppDataSource.initialize();
  });

  after(async () => {
    await AppDataSource.getRepository(Author).delete({});
    await AppDataSource.destroy();
  });

  beforeEach(() => {
    // Reset stubs, spies, and mocks
    sinon.restore();

    // Stubs and spies
    res = {
      setHeader: sinon.stub().callsFake(() => res) as unknown as SinonStub,
      status: sinon.stub().callsFake(() => {
        return res;
      }) as unknown as SinonStub,
      json: sinon.spy(),
    };
  });

  it("new author added (201)", async () => {
    req = {
      body: JSON.parse(
        JSON.stringify({
          firstName: validAuthorInputs.firstName,
          lastName: validAuthorInputs.lastName,
        })
      ),
    };

    await callAuthorAddition(req as Request, res as Response);

    statusStub = res.status as SinonStub;
    setHeaderStub = res.setHeader as SinonStub;

    assert.strictEqual(
      setHeaderStub.calledWith("x-api-version", apiVersionNumbers.VERSION_1_0),
      true
    );
    assert.strictEqual(statusStub.calledWith(httpCodes.CREATED), true);
  });
});
