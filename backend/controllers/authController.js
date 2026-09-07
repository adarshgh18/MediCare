const User = require("../models/user");
const Doctor = require("../models/doctor");


// ----------------------------------
// Patient Registration
// ----------------------------------

exports.registerUser = async (req, res) => {

    try {

        const {
            fullName,
            username,
            email,
            password
        } = req.body;


        const existingUsername =
            await User.findOne({ username });

        if (existingUsername) {

            return res.status(409).json({
                success: false,
                message: "Username already exists.",
            });

        }


        const existingEmail =
            await User.findOne({ email });

        if (existingEmail) {

            return res.status(409).json({
                success: false,
                message: "Email already exists.",
            });

        }


        const newUser = new User({
            fullName,
            username,
            email,
            role: "patient",
        });


        const registeredUser =
            await User.register(
                newUser,
                password
            );


        req.login(
            registeredUser,
            (err) => {

                if (err) {

                    return res.status(500).json({
                        success: false,
                        message: err.message,
                    });

                }


                return res.status(201).json({

                    success: true,

                    message:
                        "Registration successful. User logged in.",

                    user: {

                        id: registeredUser._id,

                        fullName:
                            registeredUser.fullName,

                        username:
                            registeredUser.username,

                        email:
                            registeredUser.email,

                        role:
                            registeredUser.role,

                    },

                });

            }
        );

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: err.message,

        });

    }

};



// ----------------------------------
// Doctor Registration
// ----------------------------------

exports.registerDoctor = async (req, res) => {

    try {

        const {
            fullName,
            username,
            email,
            password,

            specialization,
            experience,
            consultationFee,
            qualification,
            hospital,
            bio,
        } = req.body;


        // ------------------------------
        // Check username
        // ------------------------------

        const existingUsername =
            await User.findOne({ username });

        if (existingUsername) {

            return res.status(409).json({

                success: false,

                message:
                    "Username already exists.",

            });

        }


        // ------------------------------
        // Check email
        // ------------------------------

        const existingEmail =
            await User.findOne({ email });

        if (existingEmail) {

            return res.status(409).json({

                success: false,

                message:
                    "Email already exists.",

            });

        }


        // ------------------------------
        // Create doctor user
        // ------------------------------

        const newUser = new User({

            fullName,

            username,

            email,

            role: "doctor",

        });


        const registeredUser =
            await User.register(
                newUser,
                password
            );


        // ------------------------------
        // Create doctor profile
        // ------------------------------

        const doctor =
            await Doctor.create({

                user: registeredUser._id,

                specialization,

                experience,

                consultationFee,

                qualification,

                hospital,

                bio,

            });


        // ------------------------------
        // Admin creating doctor
        // ------------------------------

        if (req.user?.role === "admin") {

            return res.status(201).json({

                success: true,

                message: "Doctor added successfully.",

                user: {
                    id: registeredUser._id,
                    fullName: registeredUser.fullName,
                    username: registeredUser.username,
                    email: registeredUser.email,
                    role: registeredUser.role,

                },

                doctor,

            });

        }


        // ------------------------------
        // Normal doctor registration
        // ------------------------------

        req.login( registeredUser, (err) => {

                if (err) {

                    return res.status(500).json({
                        success: false,
                        message: err.message,
                    });

                }

                return res.status(201).json({

                    success: true,
                    message: "Doctor registration successful. Doctor logged in.",

                    user: {
                        id: registeredUser._id,
                        fullName: registeredUser.fullName,
                        username:registeredUser.username,
                        email: registeredUser.email,
                        role: registeredUser.role,
                    },

                    doctor,

                });

            }
        );

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message:
                err.message,

        });

    }

};

exports.loginUser = (req, res) => {

    return res.status(200).json({
        success: true,
        message: "Login successful.",
        user: {
            id: req.user._id,
            fullName: req.user.fullName,
            username: req.user.username,
            email: req.user.email,
            role: req.user.role,
        },
    });

};

exports.getCurrentUser = (req, res) => {

    return res.status(200).json({
        success: true,
        user: req.user,
    });

};

exports.logoutUser = (req, res, next) => {

    req.logout((err) => {

        if (err) {
            return next(err);
        }

        req.session.destroy((err) => {

            if (err) {
                return next(err);
            }

            res.clearCookie("connect.sid");

            return res.status(200).json({
                success: true,
                message: "Logged out successfully.",
            });

        });

    });

};