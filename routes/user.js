import express from "express";
import User from "../models/user.js";
import { wrapAsync } from "../utils/wrapAsync.js";
import passport from "passport";
import isLoggedIn, { saveRedirectUrl } from "../middleware/middleware.js";

const router = express.Router();

router.get("/signup", (req, res) => {
    res.render("users/signup");
});

router.post("/signup", wrapAsync(async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ username, email });
        const userRegister = await User.register(newUser, password);
        req.login(userRegister, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to Airbnb");
            res.redirect("/");
        })
        // console.log(userRegister);
    } catch (err) {
        // console.log(err)
        req.flash("error", err.message);
        res.redirect("/signup");
    }

}));

router.get("/signIn", (req, res) => {
    res.render("users/signIn");
});

router.post("/signIn",
    saveRedirectUrl,
    passport.authenticate('local', {
        failureRedirect: '/signIn', failureFlash: true
    }),
    async (req, res) => {
        req.flash("success", "Welcome back to airbnb");
        res.redirect(res.locals.redirectUrl || "/");
    });

router.get("/logout", isLoggedIn, (req, res, next) => {
    // console.log(req.user)
    req.logOut((err) => {
        if (err) {
            return next(err);
        }

        req.flash("success", "Logout successfully");
        res.redirect("/");
    });
});


router.get("/profile", isLoggedIn, (req, res) => {
    res.render("users/profile");
});

router.get('/changePassword', (req, res) => {
    res.send("working");
});
router.get('/listings', (req, res) => {
    res.send("working");
});


export default router;