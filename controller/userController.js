import User from "../models/user.js";

export const renderSignUpForm = (req, res) => {
    res.render("users/signup");
}

export const signUp = async (req, res, next) => {
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

}
export const renderLoginForm = (req, res) => {
    res.render("users/signIn");
}
export const loginUser = async (req, res) => {
    req.flash("success", "Welcome back to airbnb");
    res.redirect(res.locals.redirectUrl || "/");
}

export const logout = (req, res, next) => {
    // console.log(req.user)
    req.logOut((err) => {
        if (err) {
            return next(err);
        }

        req.flash("success", "Logout successfully");
        res.redirect("/");
    });
}

export const userProfile = (req, res) => {
    res.render("users/profile");
}

export const changePassword = (req, res) => {
    res.send("working");
}

export const myListings = (req, res) => {
    res.send("working");
}