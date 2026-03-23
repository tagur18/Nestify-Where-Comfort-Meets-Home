const Listing  = require("./models/listing");
const { listingSchema } = require("../schema.js");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You Msut be Logged in to create Listing!");
    return res.redirect("/users/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req,res,next) =>{
 if(req.session.redirectUrl) { 
  res.locals.redirectUrl = req.session.redirectUrl;
 }next();
};

module.exports.isOwner = async(req,res,next) =>{
let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing.owner.equals(req.user._id)) {
      req.flash("error", "You are not the Owner of this Listing ");
      return res.redirect(`/listings/${id}`);
    }
    next();
};


 module.exports.validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    req.flash("error", error.details[0].message);
    return res.redirect("/listings/new");
  }
  next();
};

const express = require("express");
const router = express.Router();

const Expresserr = require("./utils/Expresserrorr.js");
const wrapAsync = require("./utils/wrapasync.js");
const Listing = require("./models/listing.js");

const { isLoggedIn, isOwne, validateListing } = require("../middleware.js");

// 🔹 Validation Middleware (FIXED)


// 🔹 INDEX
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const alllistings = await Listing.find({});
    res.render("listings/index.ejs", { alllistings });
  })
);

// 🔹 NEW
router.get("/new",isLoggedIn,(req, res) => {

  res.render("listings/new.ejs");
});

// 🔹 SHOW
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;

    const listing = await Listing.findById(id).populate( "reviews").populate("owner");

    if (!listing) {
      throw new Expresserr(404, "Listing not found");
    }

    res.render("listings/show.ejs", { listing });
  })
);

// 🔹 CREATE
router.post(
  "/",
isLoggedIn,
  validateListing,
  wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id; 
    await newListing.save();

    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
  })
);

// 🔹 EDIT
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
}));

// 🔹 UPDATE
router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(async (req, res) => {
  let { id } = req.params;

  await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
}));

// 🔹 DELETE
router.delete(
  "/:id",isLoggedIn, isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;

    await Listing.findByIdAndDelete(id);

    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
  })
);

module.exports = router;


