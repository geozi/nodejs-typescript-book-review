import assert from "assert";
import { NotFoundError } from "errors/notFoundErrorClass";
import { ServerError } from "errors/serverErrorClass";
import { IReview } from "interfaces/documents/IReview";
import { IBook } from "interfaces/secondary/IBook";
import { ICompositeIndex } from "interfaces/secondary/ICompositeIndex";
import { IReviewUpdate } from "interfaces/secondary/IReviewUpdate";
import { Review } from "models/Review";
import { Error, Types } from "mongoose";
import {
  addReview,
  getReviewByCompositeIndex,
  getReviewById,
  getReviewsByBook,
  getReviewsByUsername,
  updateReview,
} from "repositories/reviewRepository";
import sinon, { SinonStub } from "sinon";
import { validReviewInputs } from "tests/testInputs";

describe("Review repository unit tests", () => {
  let mockReview: IReview;
  let functionStub: SinonStub;
  let mockId: Types.ObjectId;
  let mockUpdateObject: IReviewUpdate;
  let mockBook: IBook;
  let mockReviews: IReview[];
  let mockCompositeIndex: ICompositeIndex;
  let mockUsername: string;
  let mockSubject: string;

  describe(`${getReviewById.name}`, () => {
    beforeEach(() => {
      // Reset stubs
      sinon.restore();

      // Stubs
      functionStub = sinon.stub(Review, "findById");

      // Mocks
      mockId = new Types.ObjectId("67f63084a7b8ce1c0da7f378");
      mockReview = new Review();
      mockReview._id = mockId;
    });

    it("Promise resolves to IReview object", async () => {
      functionStub.resolves(mockReview);

      const updatedReview = await getReviewById(mockId);

      assert(updatedReview instanceof Review);
      assert.strictEqual(updatedReview._id, mockId);
    });

    it("Promise resolves to null -> NotFoundError", async () => {
      functionStub.resolves(null);

      try {
        await getReviewById(mockId);
      } catch (error) {
        assert(error instanceof NotFoundError);
      }
    });

    it("Promise rejects -> ServerError", async () => {
      functionStub.rejects();

      try {
        await getReviewById(mockId);
      } catch (error) {
        assert(error instanceof ServerError);
      }
    });
  });

  describe(`${addReview.name}`, () => {
    beforeEach(() => {
      // Reset stubs
      sinon.restore();

      // Stubs
      functionStub = sinon.stub(Review.prototype, "save");

      // Mocks
      mockReview = new Review();
    });

    it("Promise resolves to IReview object", async () => {
      functionStub.resolves(mockReview);

      const savedReview = await addReview(mockReview);

      assert(savedReview instanceof Review);
    });

    it("Promise rejects -> ValidationError", async () => {
      functionStub.rejects(new Error.ValidationError());

      try {
        await addReview(mockReview);
      } catch (error) {
        assert(error instanceof Error.ValidationError);
      }
    });

    it("Promise rejects -> ServerError", async () => {
      functionStub.rejects();

      try {
        await addReview(mockReview);
      } catch (error) {
        assert(error instanceof ServerError);
      }
    });
  });

  describe(`${updateReview.name}`, () => {
    beforeEach(() => {
      // Reset stubs
      sinon.restore();

      // Stubs
      functionStub = sinon.stub(Review, "findByIdAndUpdate");

      // Mocks
      mockId = new Types.ObjectId("67f63084a7b8ce1c0da7f378");
      mockUpdateObject = {
        id: mockId,
      };
      mockReview = new Review();
      mockReview._id = mockId;
    });

    it("Promise resolves to IReview object", async () => {
      functionStub.resolves(mockReview);

      const updatedReview = await updateReview(mockUpdateObject);

      assert(updatedReview instanceof Review);
      assert.strictEqual(updatedReview._id, mockUpdateObject.id);
    });

    it("Promise resolves to null -> NotFoundError", async () => {
      functionStub.resolves(null);

      try {
        await updateReview(mockUpdateObject);
      } catch (error) {
        assert(error instanceof NotFoundError);
      }
    });

    it("Promise rejects -> ServerError", async () => {
      functionStub.rejects();

      try {
        await updateReview(mockUpdateObject);
      } catch (error) {
        assert(error instanceof ServerError);
      }
    });
  });

  describe(`${getReviewsByBook.name}`, () => {
    beforeEach(() => {
      // Reset stubs
      sinon.restore();

      // Stubs
      functionStub = sinon.stub(Review, "find");

      // Mocks
      mockBook = {
        id: 1,
      };
      mockReviews = [new Review(), new Review()];
    });

    it("Promise resolves to IReview[]", async () => {
      functionStub.resolves(mockReviews);

      const retrievedReviews = await getReviewsByBook(mockBook);

      assert.strictEqual(retrievedReviews.length, 2);
    });

    it("Promise resolves to an empty array -> NotFoundError", async () => {
      functionStub.resolves([]);

      try {
        await getReviewsByBook(mockBook);
      } catch (error) {
        assert(error instanceof NotFoundError);
      }
    });

    it("Promise rejects -> ServerError", async () => {
      functionStub.rejects();

      try {
        await getReviewsByBook(mockBook);
      } catch (error) {
        assert(error instanceof ServerError);
      }
    });
  });

  describe(`${getReviewsByUsername.name}`, () => {
    beforeEach(() => {
      // Reset stubs
      sinon.restore();

      // Stubs
      functionStub = sinon.stub(Review, "find");

      // Mocks
      mockBook = {
        id: 1,
      };
      mockReviews = [new Review(), new Review()];
      mockUsername = validReviewInputs.username;
    });

    it("Promise resolves to IReview[]", async () => {
      functionStub.resolves(mockReviews);

      const retrievedReviews = await getReviewsByUsername(mockUsername);

      assert.strictEqual(retrievedReviews.length, 2);
    });

    it("Promise resolves to an empty array -> NotFoundError", async () => {
      functionStub.resolves([]);

      try {
        await getReviewsByUsername(mockUsername);
      } catch (error) {
        assert(error instanceof NotFoundError);
      }
    });

    it("Promise rejects -> ServerError", async () => {
      functionStub.rejects();

      try {
        await getReviewsByUsername(mockUsername);
      } catch (error) {
        assert(error instanceof ServerError);
      }
    });
  });

  describe(`${getReviewByCompositeIndex.name}`, () => {
    beforeEach(() => {
      // Reset stubs
      sinon.restore();

      // Stubs
      functionStub = sinon.stub(Review, "findOne");

      // Mocks
      mockBook = {
        id: 1,
      };
      mockSubject = validReviewInputs.subject;
      mockUsername = validReviewInputs.username;
      mockCompositeIndex = {
        subject: mockSubject,
        username: mockUsername,
      };
      mockReview = new Review();
      mockReview.subject = mockSubject;
      mockReview.username = mockUsername;
    });

    it("Promise resolves to IReview object", async () => {
      functionStub.resolves(mockReview);

      const retrievedReview = await getReviewByCompositeIndex(
        mockCompositeIndex
      );

      assert(retrievedReview instanceof Review);
      assert.strictEqual(retrievedReview.subject, mockCompositeIndex.subject);
      assert.strictEqual(retrievedReview.username, mockCompositeIndex.username);
    });

    it("Promise resolves to null -> NotFoundError", async () => {
      functionStub.resolves(null);

      try {
        await getReviewByCompositeIndex(mockCompositeIndex);
      } catch (error) {
        assert(error instanceof NotFoundError);
      }
    });

    it("Promise rejects -> ServerError", async () => {
      functionStub.rejects();

      try {
        await getReviewByCompositeIndex(mockCompositeIndex);
      } catch (error) {
        assert(error instanceof ServerError);
      }
    });
  });
});
