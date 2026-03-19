import { ExpressError } from "./error.js";
import { listingSchema, reviewSchema } from "./joiSchema.js";

const vaildateListing = (req, res, next) => {
    console.log("req body", req.body);
    const { error } = listingSchema.validate(req.body);
    if (error) {
        console.log("error", error);
        const msg = error.details[0].message;
        console.log("msg", msg);
        throw new ExpressError(400, msg);
    }
    next();
};

export const vaildateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        console.log("error", error);
        const msg = error.details[0].message;
        console.log("msg", msg);
        throw new ExpressError(400, msg);
    }
    next();
}

export { vaildateListing };