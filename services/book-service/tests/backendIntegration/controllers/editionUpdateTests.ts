import assert from "assert";
import { AppDataSource } from "config/dataSource";
import { callEditionUpdate } from "controllers/editionController";
import { Edition } from "entities/Edition";
import { Request, Response } from "express";
import { editionControllerResponseMessages } from "messages/response/editionControllerResponseMessages";
import { apiVersionNumbers } from "resources/codes/apiVersionNumbers";
import { httpCodes } from "resources/codes/responseStatusCodes";
import sinon, { SinonSpy, SinonStub } from "sinon";
import { validEditionInputs } from "tests/testInputs";
import { UpdateResult } from "typeorm";

describe("Edition update integration tests", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusStub: SinonStub;
  let jsonSpy: SinonSpy;
  let setHeaderStub: SinonStub;
  let updateFuncStub: SinonStub;
  let findOneByStub: SinonStub;
  let mockUpdateResult: UpdateResult;
  let mockEdition: Edition;
  let mockId: string;

  describe("Positive scenarios", () => {
    beforeEach(() => {
      // Reset stubs and mocks
      sinon.restore();

      // Stubs
      updateFuncStub = sinon.stub(
        AppDataSource.getRepository(Edition),
        "update"
      );
      findOneByStub = sinon.stub(
        AppDataSource.getRepository(Edition),
        "findOneBy"
      );

      res = {
        setHeader: sinon.stub().callsFake(() => res) as unknown as SinonStub,
        status: sinon.stub().callsFake(() => res) as unknown as SinonStub,
        json: sinon.spy(),
      };

      // Mocks
      mockId = "1";
      mockUpdateResult = new UpdateResult();
      mockUpdateResult.affected = 1;
      mockEdition = new Edition();
      mockEdition.id = Number(mockId).valueOf();
      mockEdition.pageCount = validEditionInputs.page_count;
    });

    it("ok (200)", async () => {
      updateFuncStub.resolves(mockUpdateResult);
      findOneByStub.resolves(mockEdition);

      req = {
        body: JSON.parse(
          JSON.stringify({
            id: mockId,
            pageCount: validEditionInputs.page_count.toString(),
          })
        ),
      };

      await callEditionUpdate(req as Request, res as Response);

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
          message: editionControllerResponseMessages.EDITION_UPDATED,
          data: mockEdition,
        }),
        true
      );
    });
  });
});
