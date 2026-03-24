const express = require("express");
const router = express.Router();

const Expresserr = require("../utils/Expresserrorr.js");
const wrapAsync = require("../utils/wrapasync.js");
const Listing = require("../models/listing.js");
const listingController = require("../controllers/listings.js");
const multer = require('multer');
 const {storage} = require("../cloudconfig.js");
const upload = multer({storage});
const {
  isLoggedIn,
  isOwner,
  validateListing,  
} = require("../middleware.js");



router
.route("/")
.get(wrapAsync(listingController.index))
.post(
  isLoggedIn,
  upload.single("listing[image]"),
   validateListing,
  wrapAsync(listingController.createListing)
);

// 🔹 NEW
router.get("/new", isLoggedIn,listingController.renderNewForm);
 
router
.route("/:id")
 .get(wrapAsync(listingController.showListing)
)
.put(isLoggedIn,isOwner,
    upload.single("listing[image]"),
    validateListing,
  wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner,
  wrapAsync(listingController.deleteListing));

// 🔹 EDIT
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);


// 🔍 LIVE SEARCH API
router.get("/search/api", async (req, res) => {
  const { q } = req.query;
  let listings;
  if (!q || q.trim() === "") {
    listings = await Listing.find({});
  } else {
    listings = await Listing.find({
      title: { $regex: q, $options: "i" }
    });
  }
  res.json(listings);
});


module.exports = router;

