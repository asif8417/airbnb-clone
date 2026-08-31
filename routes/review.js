const express = require("express");
const router=express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {validateReview, isLoggedIN,isReviewAuthor} = require("../middleware.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const reviewController=require("../controllers/reviews.js");


//Review route

router.post("/", isLoggedIN,  validateReview, wrapAsync (reviewController.createReview));

//delete review rout
router.delete("/:reviewId",isLoggedIN, isReviewAuthor,wrapAsync(reviewController.deleteReview) );

module.exports=router;
