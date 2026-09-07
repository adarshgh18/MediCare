const Review = require("../models/review");
const Appointment = require("../models/appointment");
const Doctor = require("../models/doctor");


exports.createReview = async (req, res) => {

    const { appointmentId, rating, comment } = req.body;


    // Check required fields

    if (!appointmentId || !rating) {

        return res.status(400).json({
            success: false,
            message: "Appointment and rating are required.",
        });

    }


    // Validate rating

    if (rating < 1 || rating > 5) {

        return res.status(400).json({
            success: false,
            message: "Rating must be between 1 and 5.",
        });

    }


    // Find appointment belonging to logged-in patient

    const appointment = await Appointment.findOne({
        _id: appointmentId,
        patient: req.user._id,
    });


    if (!appointment) {

        return res.status(404).json({
            success: false,
            message: "Appointment not found.",
        });

    }


    // Only completed appointments can be reviewed

    if (appointment.status !== "Completed") {

        return res.status(400).json({
            success: false,
            message: "You can only review completed appointments.",
        });

    }


    // Check if already reviewed

    const existingReview = await Review.findOne({
        appointment: appointment._id,
    });


    if (existingReview) {

        return res.status(400).json({
            success: false,
            message: "You have already reviewed this appointment.",
        });

    }


    // Verify doctor still exists

    const doctor = await Doctor.findById(
        appointment.doctor
    );


    if (!doctor) {

        return res.status(404).json({
            success: false,
            message: "Doctor not found.",
        });

    }


    // Create review

    const review = await Review.create({

        patient: req.user._id,

        doctor: appointment.doctor,

        appointment: appointment._id,

        rating,

        comment: comment?.trim(),

    });


    res.status(201).json({

        success: true,

        message: "Review submitted successfully.",

        review,

    });

};


exports.getMyReviews = async (req, res) => {

    const reviews = await Review.find({
        patient: req.user._id,
    }).select("appointment doctor rating comment createdAt");


    res.status(200).json({

        success: true,

        reviews,

    });

};

exports.getDoctorReviews = async (req, res) => {

    const reviews = await Review.find({
        doctor: req.params.doctorId,
    })
        .populate("patient", "fullName")
        .sort({ createdAt: -1 });


    const reviewCount = reviews.length;


    const averageRating =
        reviewCount > 0
            ? Number(
                (
                    reviews.reduce(
                        (sum, review) =>
                            sum + review.rating,
                        0
                    ) / reviewCount
                ).toFixed(1)
            )
            : null;


    res.status(200).json({

        success: true,

        averageRating,

        reviewCount,

        reviews,

    });

};