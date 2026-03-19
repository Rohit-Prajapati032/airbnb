import express from 'express'
import Listing from '../models/listing.js';
import { vaildateReview } from '../utils/vaildateListing.js';
import { wrapAsync } from '../utils/wrapAsync.js';
import Review from '../models/review.js';
import isLoggedIn from '../middleware/middleware.js';


const router = express.Router({ mergeParams: true });
router.post("/", isLoggedIn, vaildateReview, wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    const newReview = new Review(req.body.review);
    newReview.auther = req.user._id;
    console.log(req.user._id);

    listing.reviews.push(newReview);
    console.log(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "New Review Created");
    res.redirect(`/listings/${listing.id}`);
}));


export default router;