const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
//const Listing = require("../models/listing.js");
const multer=require("multer");
const {storage}=require("../cloudConfig.js");
const upload=multer({storage });
const User = require("../models/user.js");

const { isLoggedIN, isOwner, validateListing } = require("../middleware.js");
const listingController=require("../controllers/listings.js");

//index route
router.route("/")
.get( wrapAsync(listingController.index))
.post(isLoggedIN,
    validateListing,
     upload.single('listing[image]'),
 
 wrapAsync(listingController.createListing));



//new route
router.get("/new", isLoggedIN,listingController.renderNewForm );

router.get("/wishlist", isLoggedIN, listingController.wishlist);

// ⭐ THIS MUST COME BEFORE /:id
router.post("/:id/wishlist", isLoggedIN, wrapAsync(async (req, res) => {
    const user = await User.findById(req.user._id);
    const listingId = req.params.id;
    if (user.wishlist.includes(listingId)) {
        user.wishlist.pull(listingId);
    } else {
        user.wishlist.push(listingId);
    }
    await user.save();
    res.redirect(req.get("referer"));

}));


// Show route
router.get("/:id", wrapAsync(listingController.showListing));


//Edit route
router.get("/:id/edit", isLoggedIN, isOwner, wrapAsync(listingController.editRender));

//Update route
router.put("/:id", isLoggedIN, isOwner, upload.single('listing[image]'),wrapAsync(listingController.updateListing));

//DELETE ROUTE
router.delete("/:id", isLoggedIN, isOwner, wrapAsync(listingController.destroyListing));

module.exports = router;
