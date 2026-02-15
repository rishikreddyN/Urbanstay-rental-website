const express = require("express");
const router = express.Router({mergeParams:true});
const { isLoggedIn } = require("../middleware.js");


const wrapAsync = require("../util/wrapAsync.js");
const ExpressError = require("../util/ExpressError.js");
const { reviewSchema } = require("../schema.js");

const reviewController = require("../controllers/review.js");

// validation middleware
const validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);

    if(error){
        let errMsg = error.details.map(el=>el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};



// CREATE REVIEW
router.post(
    "/",
     isLoggedIn,
    validateReview,
    wrapAsync(reviewController.createReview)
);

// DELETE REVIEW
router.delete(
    "/:reviewId",
    wrapAsync(reviewController.destroyReview)
);

module.exports = router;
