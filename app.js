if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
}
const dns = require('dns');
dns.setServers(['1.1.1.1', '8.8.8.8'])
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js")
//const MONGO_URL = "mongodb://127.0.0.1:27017/Worldlust";
const dbUrl=process.env.ATLASDB_URL;
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js")
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const Review = require("./models/review.js");
const review = require("./models/review.js");
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const session = require("express-session");
const { MongoStore } = require("connect-mongo");
const flash = require("connect-flash");

const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter: 24*3600,
    
})
store.on("error",()=>{
    console.log("ERROR in mongo session store",err)
});
const sessionOption = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUniniatilized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};
app.use(session(sessionOption));
app.use(flash());

// Authentication
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    ;
    next();
});
/*
app.get("/demoUser", async(req, res)=>{
    let fakeuser=new User({
        email:"student123@gmail.com",
        username:"deltastudent",
    });
    let registeredUSer= await User.register(fakeuser, "helloworld");
    res.send(registeredUSer);
})
*/

main().then(() => {
    console.log("connect to Dbs")
})
    .catch((err) => {
        console.log(err);
    });
async function main() {
    await mongoose.connect(dbUrl);
}
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

//  MAP functionality
app.get("/api/geocode", async (req, res) => {
    try {
        const { location } = req.query;

        if (!location) {
            return res.status(400).json({ error: "Location is required" });
        }

        const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(location)}&filter=countrycode:in&limit=1&format=json&apiKey=${process.env.GEOAPIFY_API_KEY}`;

        const response = await fetch(url);
        const data = await response.json();

        if (!data.results || data.results.length === 0) {
            return res.status(404).json({ error: "Location not found" });
        }

        const { lat, lon } = data.results[0];

        res.json({ lat, lon });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Geocoding failed" });
    }
});
/*
app.get("/", (req, res) => {
    res.send("hey i am root");
});
*/
const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMas = error.details.map((el) => el.message).join("");
        throw new ExpressError(400, errMas);
    } else {
        next();
    }
};

app.use("/listings", listings)
app.use("/listings/:id/reviews", reviews);
app.use("/", userRouter)

app.all(/.*/, (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err;
    res.render("error.ejs", { message });
    //res.status(statusCode).send(message);
});

app.listen(8080, () => {
    console.log("server is listening to port");
});

