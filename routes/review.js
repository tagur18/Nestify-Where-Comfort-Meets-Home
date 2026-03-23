const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing.js");

const Expresserr = require("../utils/Expresserrorr.js");
const wrapAsync = require("../utils/wrapasync.js");
const {validateReview, isLoggedIn,isReviewAuthor}= require("../middleware.js");
const { reviewSchema } = require("../schema.js");
const Review = require("../models/reviews.js");
const reviewController = require("../controllers/reviews.js");

// 🔹 Validation
// ➕ Create Review
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.createReview)
);

// ❌ Delete Review
router.delete(
  "/:reviewId", isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.deleteReview)
);

module.exports = router;