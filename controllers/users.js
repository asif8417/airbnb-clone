const User = require("../models/user.js");

module.exports.signupRenderForm= (req, res) => {
res.render("users/signup.ejs");
}

module.exports.signup=async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        //console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to woderlust");
            res.redirect("/listings");
        })

    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}

module.exports.loginRenderForm= (req, res) => {
    res.render("users/login.ejs");
}

module.exports.login=async (req, res) => {
        req.flash("success", "welcome to wnderlust, you are logged in successfully");
       let redirectUrl=res.locals.redirectUrl || "/listings";
       res.redirect(redirectUrl);
    }

    module.exports.logout=(req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err)
        }
        req.flash("error", "you are logout");
        res.redirect("/listings");
    })
}
module.exports.profile = async (req, res) => {
    const user = await User.findById(req.user._id)
        .populate("wishlist");

    res.render("users/profile.ejs", { user });
};

module.exports.renderEditProfile=async(req, res)=>{
    const user=await User.findById(req.user._id);
    res.render("users/edit.ejs", {user});
};

module.exports.updateProfile = async (req, res) => {
    const { email, about } = req.body;

    const user = await User.findById(req.user._id);

    user.email = email;
    user.about = about;

    await user.save();

    req.flash("success", "Profile updated successfully!");
    res.redirect("/profile");
};