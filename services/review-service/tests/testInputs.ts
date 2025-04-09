export const validReviewInputs = {
  subject: "This is a valid review",
  description: "The book was a great read, ideal for relaxing times.",
  book: {
    id: 1,
  },
};

export const invalidReviewInputs = {
  SUBJECT_TOO_SHORT: "S",
  SUBJECT_TOO_LONG: `This subject title is incredibly long and rambling, exceeding the one hundred character limit without a care in the world!`,
  DESCRIPTION_TOO_SHORT: "Short!",
  DESCRIPTION_TOO_LONG: `This description is far too verbose and excessive, stretching on and on past the three hundred character limit that has been imposed for validation purposes. It seems to have no regard for constraints, and thus should undoubtedly fail validation criteria due to its sheer length and disregard for brevity.`,
  NEGATIVE_BOOK_ID: -1,
  INVALID_REVIEW_ID_STRING: "1",
  INVALID_REVIEW_ID_INTEGER: 1,
};
