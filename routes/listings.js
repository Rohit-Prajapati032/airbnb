import express from 'express'
import { wrapAsync } from '../utils/wrapAsync.js';
import { vaildateListing } from '../utils/vaildateListing.js';
import isLoggedIn, { isOwner } from '../middleware/middleware.js';
import { destroyListing, editListing, editListingForm, index, listingNewForm, newListing, showListing } from '../controller/listingController.js';
import multer from 'multer';
import { storage } from '../config/cloudconfig.js';

const uplode = multer({ storage });
const router = express.Router();

//  <------------------- routes listings-------------------->
//index route 
router.get("/", wrapAsync(index));

//listing new form 
router.get("/listings/new",
    isLoggedIn,
    listingNewForm);
// add new listing route
router.post(
    "/listings",
    isLoggedIn,
    vaildateListing,
    uplode.single('listing[image]'),
    wrapAsync(newListing)
);
// edit listing form 
router.get("/listings/:id/edit", isLoggedIn, wrapAsync(editListingForm));

//same route 
router.route("/listings/:id")
    .get(wrapAsync(showListing))//show listing
    .put(isLoggedIn, isOwner, uplode.single('listing[image]'), vaildateListing, wrapAsync(editListing))//edit listing
    .delete(isLoggedIn, isOwner, wrapAsync(destroyListing));//delete listing

export default router;
