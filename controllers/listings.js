const Listing=require("../models/listing");
const { listingSchema } = require("../schema.js");
const User = require("../models/user.js");
const countries = require("../utils/countries.js");

module.exports.index=async (req, res) => {
    const alllisting = await Listing.find({}).populate("reviews");
    res.render("listing/index.ejs", { alllisting });
}

module.exports.renderNewForm=(req, res) => {
    res.render("./listing/new.ejs",{countries});
}

module.exports.showListing=(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews", populate: {
                path: "author",
            }
        }).populate("owner");
        if(!listing){
            req.flash("errr=or", "Listing you requested does not exist");
            res.redirect("/listings");
        }
    //  console.log(listing.image);
    res.render("./listing/show.ejs", { listing });
})


module.exports.createListing=async (req, res, next) => {
    let url=req.file.path;
    let filename=req.file.filename;
    let result = listingSchema.validate(req.body);
    // console.log(result);
    if (result.err) {
        throw new ExpressError(400, result.error);
    }
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image={url, filename};
    await newListing.save();
    req.flash("success", "new listing created");
    res.redirect("/listings");

}


module.exports.editRender=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    req.flash("success", "Edited Successfully");

    res.render("./listing/edit.ejs", { listing });

}

module.exports.updateListing=async (req, res) => {
    if (!req.body.listing) {
        throw new ExpressError(400, "Send valid data for listing")
    }
    let { id } = req.params;
    let listing=await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if(typeof req.file !== "undefined"){
     let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url, filename};
    await listing.save();
    }
    req.flash("success", "Update Successfully");

    res.redirect(`/listings/${id}`)
}

module.exports.destroyListing=async (req, res) => {
    let { id } = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Deleted Successfully");

    res.redirect("/listings");
}

module.exports.wishlist = async (req, res) => {
    const user = await User.findById(req.user._id).populate("wishlist");

    res.render("listing/wishlist.ejs", { wishlist: user.wishlist });
};

