import dotenv from 'dotenv'
dotenv.config();
// if (process.env.NODE_ENV != "production") {

// }
import express from "express";
import methodOverride from "method-override";
import ejsMate from "ejs-mate";
import { ExpressError } from "./utils/error.js";
import { requestLogger, errorLogger } from "./utils/logger.js"
import listingsRouter from "./routes/listings.js"
import reviewsRouter from "./routes/reviews.js"
import userRouter from "./routes/user.js"
import connectDB from "./config/db.js";
import session from "express-session";
import flash from "connect-flash";
import passport from "passport";
import LocalStrategy from "passport-local"
import User from "./models/user.js"
import MongoStore from "connect-mongo";



const app = express();
const PORT = 3000;
const __dirname = process.cwd();

/* ----------------- App Config ----------------- */
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.engine("ejs", ejsMate);

app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

//session 

const store = MongoStore.create({
    mongoUrl: "mongodb+srv://032rohitprajapati:rohit032@cluster0.xq7xl9k.mongodb.net/?appName=Cluster0",
    secret: {
        crypto: process.env.SECRET_KEY
    },
    touchAfter: 24 * 3600,
});
store.on("error", (err) => {
    console.log("Error is mongo store");
})
const sessionOption = {
    store: store,
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000
    }
}

app.use(session(sessionOption));

//passport 
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(flash());
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});
/* ----------------- Logger ----------------- */
app.use(requestLogger);

/* ----------------- Database ----------------- */
connectDB();

/* ----------------- Routes ----------------- */
app.use("/", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);


/* ----------------- 404 (NO wildcard) ----------------- */
app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

/* ----------------- Error Handler ----------------- */
app.use(errorLogger);  // error write the error.log filter: 

app.use((err, req, res, next) => {  //  error  print screen 
    // console.log(err); //debugging error
    const { status = 500 } = err;
    res.status(status).render("error", { err });
});


/* ----------------- Server ----------------- */
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});