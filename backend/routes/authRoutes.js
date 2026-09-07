const express = require("express");
const router = express.Router();
const passport = require("passport");

const authController = require("../controllers/authController");
const isLoggedIn = require("../middleware/isLoggedIn");

const wrapAsync = require("../utils/wrapAsync");

const {
    validateRegister,
    validateDoctorRegister,
    validateLogin,
} = require("../middleware/authValidation");

router.post(
    "/register",
    validateRegister,
    authController.registerUser
);

router.post(
    "/register-doctor",
    validateDoctorRegister,
    authController.registerDoctor
);

// router.post(
//     "/login",
//     validateLogin,
//     passport.authenticate("local"),
//     authController.loginUser
// );

router.post(
    "/login",
    validateLogin,
    (req, res, next) => {
        
        passport.authenticate(
            "local",
            (err, user, info) => {


                if (err) {
                    return next(err);
                }

                if (!user) {
                    return res.status(401).json({
                        success: false,
                        message: "Invalid username or password.",
                    });
                }
    
                req.login(user, (err) => {

                    if (err) {
                        return next(err);
                    }

                    return res.status(200).json({
                        success: true,
                        message: "Login successful.",
                        user: {
                            id: user._id,
                            fullName: user.fullName,
                            username: user.username,
                            email: user.email,
                            role: user.role,
                        },
                    });

                });

            }
        )(req, res, next);

    }
);

router.get(
    "/me",
    isLoggedIn,
    authController.getCurrentUser
);

router.post(
    "/logout",
    isLoggedIn,
    authController.logoutUser
);


module.exports = router;