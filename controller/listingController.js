import Listing from "../models/listing.js";
import { ExpressError } from "../utils/error.js";
import { getCoordinates } from "../utils/geocoding.js";
import logger from "../utils/winston.js";

export const index = async (req, res) => {
    const listings = await Listing.find();
    res.render("listings/index", { listings });
};

export const listingNewForm = (req, res) => {
    res.render("listings/newListing");
};

export const showListing = async (req, res) => {
    const { id } = req.params;
    const showListing = await Listing.findById(id).populate({
        path: "reviews",
        populate: { path: "auther" }
    }).populate("owner");
    logger.info(showListing);
    if (!showListing) {
        throw new ExpressError(404, "Listing Not Found");
    }
    // console.log(showListing.owner.username);
    res.render("listings/show", { showListing });
}

export const newListing = async (req, res) => {
    const { location, country } = req.body.listing;
    const { lat, lng } = await getCoordinates(location, country);
    const newListing = new Listing(req.body.listing);
    const url = req.file.path;
    const filename = req.file.filename;
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    newListing.geometry = { lat, lng };
    await newListing.save();
    req.flash("success", "New Listing Created");
    res.redirect("/");
}

// export const editListingForm = async (req, res) => {
//     const { id } = req.params;
//     const listing = await Listing.findById(id);
//     if (!listing) {
//         req.flash("error", " Listing you requested for does not exits");
//         res.redirect('/');
//     }
//     else {
//         let originalImageUrl = listing.image.url;
//         originalImageUrl.replace("/uplode", "/uplode/w_250/e_blur:300");
//         res.render("listings/editListing", { listing, originalImageUrl });

//     }
// }

export const editListingForm = async (req, res) => {

    const { id } = req.params;

    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing you requested does not exist");
        return res.redirect("/");
    }

    let originalImageUrl = listing.image.url;

    originalImageUrl = originalImageUrl.replace(
        "/upload",
        "/upload/w_250/e_blur:150"
    );

    res.render(
        "listings/editListing",
        { listing, originalImageUrl }
    );

};

export const editListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findByIdAndUpdate(id, req.body.listing);
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }
    req.flash("success", " Listing Updated");
    res.redirect(`/listings/${id}`);
}

export const destroyListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findByIdAndDelete(id);
    req.flash("success", " Listing Deleted");
    if (!listing) {
        req.flash("error", " Listing you requested for does not exits");
        res.redirect('/');
    }
    else {
        res.redirect("/");
    }
}