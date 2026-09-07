const Doctor = require("../models/doctor");
const Review = require("../models/review");

exports.createDoctorProfile = async (req, res) => {

    const existingDoctor = await Doctor.findOne({
        user: req.user._id,
    });

    if (existingDoctor) {
        return res.status(400).json({
            success: false,
            message: "Doctor profile already exists.",
        });
    }

    const doctor = await Doctor.create({
        user: req.user._id,
        ...req.body,
    });

    res.status(201).json({
        success: true,
        message: "Doctor profile created successfully.",
        doctor,
    });
};



exports.getMyProfile = async (req, res) => {

    const doctor = await Doctor.findOne({
        user: req.user._id,
    }).populate("user", "fullName username email role");
    // With populate Mongoose automatically replaces that ObjectId with the actual User document.

    if (!doctor) {
        return res.status(404).json({
            success: false,
            message: "Doctor profile not found.",
        });
    }

    res.status(200).json({
        success: true,
        doctor,
    });

};

exports.updateMyProfile = async (req, res) => {

    const doctor = await Doctor.findOneAndUpdate(
        { user: req.user._id },
        req.body,
        {
            new: true,
            runValidators: true,
        }
    );

    if (!doctor) {
        return res.status(404).json({
            success: false,
            message: "Doctor profile not found.",
        });
    }

    res.status(200).json({
        success: true,
        message: "Profile updated successfully.",
        doctor,
    });

};

// ---------------********------------

exports.getAllDoctors = async (req, res) => {

    const page = Math.max(
        parseInt(req.query.page) || 1,
        1
    );

    const limit = Math.min(
        parseInt(req.query.limit) || 9,
        50
    );

    const skip = (page - 1) * limit;


    const totalDoctors = await Doctor.countDocuments();


    const doctors = await Doctor.find()
        .populate("user", "fullName email")
        .skip(skip)
        .limit(limit)
        .lean();


    // Get rating information for these doctors

    const doctorIds = doctors.map(
        (doctor) => doctor._id
    );


    const ratings = await Review.aggregate([

        {
            $match: {
                doctor: {
                    $in: doctorIds,
                },
            },
        },

        {
            $group: {
                _id: "$doctor",

                averageRating: {
                    $avg: "$rating",
                },

                reviewCount: {
                    $sum: 1,
                },
            },
        },

    ]);


    // Create quick lookup map

    const ratingMap = new Map();

    ratings.forEach((rating) => {

        ratingMap.set(
            rating._id.toString(),
            {
                averageRating: Number(
                    rating.averageRating.toFixed(1)
                ),

                reviewCount: rating.reviewCount,
            }
        );

    });


    // Attach rating information to doctors

    const doctorsWithRatings = doctors.map(
        (doctor) => {

            const rating = ratingMap.get(
                doctor._id.toString()
            );


            return {

                ...doctor,

                averageRating:
                    rating?.averageRating || null,

                reviewCount:
                    rating?.reviewCount || 0,

            };

        }
    );


    const totalPages = Math.ceil(
        totalDoctors / limit
    );


    res.status(200).json({

        success: true,
        count: doctorsWithRatings.length,
        totalDoctors,
        currentPage: page,
        totalPages,
        doctors: doctorsWithRatings,

    });

};


// ---------------********-----------------

exports.getDoctorById = async (req, res) => {

    try {

        const doctor = await Doctor.findById(req.params.id)
            .populate("user", "fullName email");

        if (!doctor) {

            return res.status(404).json({
                success: false,
                message: "Doctor not found",
            });

        }

        res.status(200).json({
            success: true,
            doctor,
        });

    }

    catch (err) {

        res.status(500).json({
            success: false,
            message: err.message,
        });

    }

};

//---------Doctors should be able to update their schedule--------.

exports.updateAvailability = async (req, res) => {

    const doctor = await Doctor.findOne({
        user: req.user._id,
    });

    if (!doctor) {
        return res.status(404).json({
            success: false,
            message: "Doctor profile not found.",
        });
    }

    const { availability } = req.body;


    // -----------------------------
    // Basic validation
    // -----------------------------

    if (!Array.isArray(availability)) {

        return res.status(400).json({
            success: false,
            message: "Availability must be an array.",
        });

    }


    const validDays = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
    ];


    // -----------------------------
    // Check duplicate days
    // -----------------------------

    const days = availability.map(
        (item) => item.day
    );

    const uniqueDays = new Set(days);

    if (uniqueDays.size !== days.length) {

        return res.status(400).json({
            success: false,
            message: "The same day cannot be added twice.",
        });

    }


    // -----------------------------
    // Validate every day
    // -----------------------------

    for (const item of availability) {

        // Check day name

        if (!validDays.includes(item.day)) {

            return res.status(400).json({
                success: false,
                message: `Invalid day: ${item.day}`,
            });

        }


        // Check slots array

        if (
            !Array.isArray(item.slots) ||
            item.slots.length === 0
        ) {

            return res.status(400).json({
                success: false,
                message: `${item.day} must have at least one time slot.`,
            });

        }


        // Check empty slots

        if (
            item.slots.some(
                (slot) =>
                    typeof slot !== "string" ||
                    !slot.trim()
            )
        ) {

            return res.status(400).json({
                success: false,
                message: `Empty time slot found on ${item.day}.`,
            });

        }


        // -----------------------------
        // Check time format
        // -----------------------------

        const timeRegex =
            /^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/;

        // Check 30-minute interval

        const invalidInterval = item.slots.some((slot) => {

            const timePart = slot.split(" ")[0];

            const minutes = Number(
                timePart.split(":")[1]
            );

            return minutes !== 0 && minutes !== 30;

        });

        if (invalidInterval) {

            return res.status(400).json({
                success: false,
                message:
                    `Time slots on ${item.day} must be in 30-minute intervals.`,
            });

        }    

        if (
            item.slots.some(
                (slot) =>
                    !timeRegex.test(slot)
            )
        ) {

            return res.status(400).json({
                success: false,
                message:
                    `Invalid time format on ${item.day}. Use format like 10:00 AM.`,
            });

        }


        // -----------------------------
        // Check duplicate slots
        // -----------------------------

        const uniqueSlots = new Set(
            item.slots
        );

        if (
            uniqueSlots.size !== item.slots.length
        ) {

            return res.status(400).json({
                success: false,
                message:
                    `Duplicate time slot found on ${item.day}.`,
            });

        }

    }


    // -----------------------------
    // Save availability
    // -----------------------------

    doctor.availability = availability;

    await doctor.save();


    res.status(200).json({
        success: true,
        message: "Availability updated successfully.",
        availability: doctor.availability,
    });

};



//-----------Patients need to see a doctor's available slots------------
exports.getDoctorAvailability = async (req, res) => {

    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
        return res.status(404).json({
            success: false,
            message: "Doctor not found.",
        });
    }

    res.status(200).json({
        success: true,
        availability: doctor.availability,
    });

};