const User = require("../models/user");


// GET MY PROFILE
exports.getMyProfile = async (req, res) => {

    try {

        const user = await User.findById(req.user._id)
            .select("-hash -salt");

        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found.",
            });

        }

        res.status(200).json({
            success: true,
            user,
        });

    }

    catch (err) {

        res.status(500).json({
            success: false,
            message: err.message,
        });

    }

};


// UPDATE MY PROFILE
exports.updateMyProfile = async (req, res) => {

    try {

        const {
            fullName,
            username,
            email,
        } = req.body;


        // Basic validation

        if (!fullName?.trim()) {

            return res.status(400).json({
                success: false,
                message: "Full name is required.",
            });

        }


        if (!username?.trim()) {

            return res.status(400).json({
                success: false,
                message: "Username is required.",
            });

        }


        if (!email?.trim()) {

            return res.status(400).json({
                success: false,
                message: "Email is required.",
            });

        }


        // Check username conflict

        const existingUsername = await User.findOne({
            username: username.trim(),
            _id: { $ne: req.user._id },
        });

        if (existingUsername) {

            return res.status(400).json({
                success: false,
                message: "Username is already taken.",
            });

        }


        // Check email conflict

        const existingEmail = await User.findOne({
            email: email.trim().toLowerCase(),
            _id: { $ne: req.user._id },
        });

        if (existingEmail) {

            return res.status(400).json({
                success: false,
                message: "Email is already registered.",
            });

        }


        const user = await User.findByIdAndUpdate(

            req.user._id,

            {
                fullName: fullName.trim(),
                username: username.trim(),
                email: email.trim().toLowerCase(),
            },

            {
                new: true,
                runValidators: true,
            }

        ).select("-hash -salt");


        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found.",
            });

        }


        res.status(200).json({

            success: true,

            message: "Profile updated successfully.",

            user,

        });

    }

    catch (err) {

        res.status(500).json({
            success: false,
            message: err.message,
        });

    }

};