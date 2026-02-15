const express = require("express");
const router = express.Router();
const wrapAsync = require("../util/wrapAsync.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listings.js");
const { isLoggedIn } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer  = require('multer')
const {storage}=require("../cloudconfig.js")
const upload = multer({ storage})
// validation
const validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map(el=>el.message).join(",");
        throw new Error(errMsg);
    } else {
        next();
    }
};




// INDEX
router.get("/", wrapAsync(listingController.index));

// NEW
router.get("/new", isLoggedIn, listingController.renderNewForm);

// SHOW
router.get("/:id", wrapAsync(listingController.showListing));

// CREATE
router.post(
  "/",
  isLoggedIn,
  upload.single("listing[image]"),
  validateListing,
  wrapAsync(listingController.createListing)
);
// router.post("/", isLoggedIn, validateListing, wrapAsync(listingController.createListing));

// EDIT
router.get("/:id/edit", isLoggedIn, wrapAsync(listingController.renderEditForm));

// UPDATE
router.put(
  "/:id",
  isLoggedIn,
  upload.single("listing[image]"),   
  wrapAsync(listingController.updateListing)
);


router.get("/search", async (req, res) => {
    let { q } = req.query;

    if (!q) {
        req.flash("error", "Search empty!");
        return res.redirect("/listings");
    }

    const listings = await Listing.find({
        location: { $regex: q, $options: "i" }
    });

    res.render("listings/index.ejs", { allListings: listings });
});

// DELETE
router.delete("/:id", isLoggedIn, wrapAsync(listingController.destroyListing));

module.exports = router;
