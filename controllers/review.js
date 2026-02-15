const Listing = require("../models/listings.js");
const Review = require("../models/rating.js");

// CREATE REVIEW
module.exports.createReview = async (req,res)=>{
    console.log("REVIEW ROUTE HIT 🔥");

    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
     newReview.author = req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    req.flash("success","Review Added!");
    res.redirect(`/listings/${listing._id}`);
};

// DELETE REVIEW
module.exports.destroyReview = async (req,res)=>{
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id,{
        $pull:{ reviews: reviewId }
    });

    await Review.findByIdAndDelete(reviewId);

    req.flash("success","Review Deleted!");
    res.redirect(`/listings/${id}`);
};
