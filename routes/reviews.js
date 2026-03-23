import express from 'express'
import { vaildateReview } from '../utils/vaildateListing.js';
import { wrapAsync } from '../utils/wrapAsync.js';
import isLoggedIn from '../middleware/middleware.js';
import { newReview } from '../controller/reviewController.js';


const router = express.Router({ mergeParams: true });
router.post("/", isLoggedIn, vaildateReview, wrapAsync(newReview));


export default router;