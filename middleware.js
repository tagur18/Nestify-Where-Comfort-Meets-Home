const Listing = require("./models/listing.js");
const Expresserr = require("./utils/Expresserrorr.js");
const { listingSchema ,reviewSchema } = require("./schema.js");
const Review =require("./models/reviews.js")
// 🔐 Check if user is logged in
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in!");
    return res.redirect("/users/login");
  }
  next();
};

// 🔁 Save redirect URL after login
module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

// 🔒 Check if current user is owner of listing
module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;

  const listing = await Listing.findById(id);

  if (!listing.owner.equals(req.user._id)) {
    req.flash("error", "You are not the owner of this listing!");
    return res.redirect(`/listings/${id}`);
  }

  next(); // 🔥 IMPORTANT
};

// ✅ Validate listing (Joi)
module.exports.validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);

  if (error) {
    req.flash("error", error.details[0].message);
    return res.redirect("/listings/new");
  }

  next();
};

// review validate 
module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);

  if (error) {
    throw new Expresserr(400, error.details[0].message);
  } else {
    next();
  }
};



//author route 
module.exports.isReviewAuthor = async (req, res, next) => {
  let { id,reviewId } = req.params;

  const review = await Review.findById(reviewId);
  if (!review .author.equals(req.user._id)) {
    req.flash("error", "You are not the Author of this Review!");
    return res.redirect(`/listings/${id}`);
  }

  next(); 
};
