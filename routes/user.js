import express from "express";
import { wrapAsync } from "../utils/wrapAsync.js";
import passport from "passport";
import isLoggedIn, { saveRedirectUrl } from "../middleware/middleware.js";
import { changePassword, loginUser, logout, myListings, renderLoginForm, renderSignUpForm, signUp, userProfile } from "../controller/userController.js";

const router = express.Router();
//render signup form 
router.get("/signup", renderSignUpForm);
//signup route
router.post("/signup", wrapAsync(signUp));
//render login form 
router.get("/signIn", renderLoginForm);
//login user
router.post("/signIn",
    saveRedirectUrl,
    passport.authenticate('local', {
        failureRedirect: '/signIn', failureFlash: true
    }),
    loginUser
);
//logout user
router.get("/logout", isLoggedIn, logout);

//profile user
router.get("/profile", isLoggedIn, userProfile);
//change password
router.get('/changePassword', changePassword);
//my Listing
router.get('/mylistings', myListings);


export default router;