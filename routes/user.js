const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl, isLoggedIN} = require("../middleware.js");
const userController =require("../controllers/users.js");


router.get("/profile", isLoggedIN, userController.profile);

router.get("/profile/edit", isLoggedIN,userController.renderEditProfile);

//update Profile
router.put("/profile", isLoggedIN, wrapAsync(userController.updateProfile));

router.get("/signup",userController.signupRenderForm);

//signup
router.post("/signup", wrapAsync(userController.signup));

// login
router.get("/login",userController.loginRenderForm);

router.post("/login",saveRedirectUrl,
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true,
    }),
    userController.login);

//logged out
router.get("/logout", userController.logout);
module.exports = router;