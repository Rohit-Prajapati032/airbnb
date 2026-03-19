import express from 'express'
import { wrapAsync } from '../utils/wrapAsync.js';
import Listing from '../models/listing.js';
import { vaildateListing } from '../utils/vaildateListing.js';
import logger from '../utils/winston.js';
import flash from "connect-flash";
import { ExpressError } from '../utils/error.js';
import isLoggedIn, { isOwner } from '../middleware/middleware.js';


const router = express.Router();


//  <------------------- routes listings--------------------> 
router.get("/", wrapAsync(async (req, res) => {
    // console.log("user", req.user);
    const listings = await Listing.find();
    res.render("listings/index", { listings });
}));

router.get("/listings/new", isLoggedIn, (req, res) => {
    res.render("listings/newListing");
});

router.get("/listings/:id", wrapAsync(async (req, res) => {
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
}));

router.post(
    "/listings",
    isLoggedIn,
    vaildateListing,
    wrapAsync(async (req, res) => {
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        await newListing.save();
        req.flash("success", "New Listing Created");
        res.redirect("/");
    })
);

router.get("/listings/:id/edit", isLoggedIn, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", " Listing you requested for does not exits");
        res.redirect('/');
    }
    else {
        res.render("listings/editListing", { listing });

    }
}));

router.put("/listings/:id",
    isLoggedIn,
    isOwner,
    wrapAsync(async (req, res) => {
        const { id } = req.params;
        await Listing.findByIdAndUpdate(id, req.body.listing);
        req.flash("success", " Listing Updated");
        res.redirect(`/listings/${id}`);
    }));


router.delete("/listings/:id", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
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
}));


export default router;
