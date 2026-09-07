const User = require("../../models/user");
const Doctor = require("../../models/doctor");
const Appointment = require("../../models/appointment");
const Review = require("../../models/review");
const mongoose = require("mongoose");

exports.getAdminDoctors = async (req, res) => {
    try {
        // ----------------------------------
        // Pagination
        // ----------------------------------

        const page = Math.max(
            parseInt(req.query.page) || 1,
            1
        );

        const limit = Math.min(
            Math.max(
                parseInt(req.query.limit) || 9,
                1
            ),
            50
        );

        const skip = (page - 1) * limit;

        // ----------------------------------
        // Search & Filter
        // ----------------------------------

        const search =
            req.query.search?.trim() || "";

        const specialization =
            req.query.specialization?.trim() || "";

        // ----------------------------------
        // Base Pipeline
        // ----------------------------------

        const pipeline = [
            {
                $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "user",
                },
            },

            {
                $unwind: "$user",
            },
        ];

        // ----------------------------------
        // Search
        // ----------------------------------

        if (search) {
            pipeline.push({
                $match: {
                    $or: [
                        {
                            "user.fullName": {
                                $regex: search,
                                $options: "i",
                            },
                        },

                        {
                            "user.email": {
                                $regex: search,
                                $options: "i",
                            },
                        },

                        {
                            specialization: {
                                $regex: search,
                                $options: "i",
                            },
                        },

                        {
                            hospital: {
                                $regex: search,
                                $options: "i",
                            },
                        },

                        {
                            qualification: {
                                $regex: search,
                                $options: "i",
                            },
                        },
                    ],
                },
            });
        }

        // ----------------------------------
        // Specialization Filter
        // ----------------------------------

        if (specialization) {
            pipeline.push({
                $match: {
                    specialization: {
                        $regex: `^${specialization}$`,
                        $options: "i",
                    },
                },
            });
        }

        // ----------------------------------
        // Sort
        // ----------------------------------

        pipeline.push({
            $sort: {
                createdAt: -1,
            },
        });

        // ----------------------------------
        // Count + Summary + Doctors
        // ----------------------------------

        pipeline.push({
            $facet: {

                // --------------------------
                // Doctors for current page
                // --------------------------

                doctors: [
                    {
                        $skip: skip,
                    },

                    {
                        $limit: limit,
                    },

                    // --------------------------
                    // Patients treated
                    // --------------------------

                    {
                        $lookup: {
                            from: "appointments",

                            let: {
                                doctorId: "$_id",
                            },

                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $and: [
                                                {
                                                    $eq: [
                                                        "$doctor",
                                                        "$$doctorId",
                                                    ],
                                                },

                                                {
                                                    $eq: [
                                                        "$status",
                                                        "Completed",
                                                    ],
                                                },
                                            ],
                                        },
                                    },
                                },

                                // One patient only once
                                {
                                    $group: {
                                        _id: "$patient",
                                    },
                                },

                                {
                                    $count: "count",
                                },
                            ],

                            as: "patientStats",
                        },
                    },

                    {
                        $addFields: {
                            patientsTreated: {
                                $ifNull: [
                                    {
                                        $arrayElemAt: [
                                            "$patientStats.count",
                                            0,
                                        ],
                                    },

                                    0,
                                ],
                            },
                        },
                    },

                    {
                        $project: {
                            patientStats: 0,
                        },
                    },
                ],

                // --------------------------
                // Total doctors
                // --------------------------

                total: [
                    {
                        $count: "count",
                    },
                ],

                // --------------------------
                // Summary
                // --------------------------

                summary: [
                    {
                        $group: {
                            _id: null,

                            activeDoctors: {
                                $sum: {
                                    $cond: [
                                        {
                                            $ne: [
                                                "$user.isActive",
                                                false,
                                            ],
                                        },

                                        1,

                                        0,
                                    ],
                                },
                            },

                            specializations: {
                                $addToSet:
                                    "$specialization",
                            },

                            averageExperience: {
                                $avg: {
                                    $convert: {
                                        input:
                                            "$experience",

                                        to: "double",

                                        onError: null,

                                        onNull: null,
                                    },
                                },
                            },
                        },
                    },
                ],
            },
        });

        // ----------------------------------
        // Execute
        // ----------------------------------

        const result =
            await Doctor.aggregate(
                pipeline
            );

        const data =
            result[0] || {};

        const doctors =
            data.doctors || [];

        const totalDoctors =
            data.total?.[0]?.count || 0;

        const summary =
            data.summary?.[0] || {};

        // ----------------------------------
        // Total Pages
        // ----------------------------------

        const totalPages =
            Math.ceil(
                totalDoctors / limit
            ) || 1;

        // ----------------------------------
        // Response
        // ----------------------------------

        return res.status(200).json({
            success: true,

            count: doctors.length,

            totalDoctors,

            currentPage: page,

            totalPages,

            activeDoctors:
                summary.activeDoctors || 0,

            specializationCount:
                (summary.specializations || [])
                    .filter(Boolean)
                    .length,

            averageExperience:
                Number(
                    summary.averageExperience || 0
                ),

            doctors,
        });
    }

    catch (err) {
        console.error(
            "Admin doctors error:",
            err
        );

        return res.status(500).json({
            success: false,

            message:
                "Failed to fetch doctors.",
        });
    }
};


// ----------------------------------
// Get single doctor - Admin
// ----------------------------------

exports.getAdminDoctorById = async (req, res) => {

    try {

        const { id } = req.params;

        // ----------------------------------
        // Validate ObjectId
        // ----------------------------------

        if (!/^[0-9a-fA-F]{24}$/.test(id)) {

            return res.status(404).json({
                success: false,
                message: "Doctor not found.",
            });

        }


        // ----------------------------------
        // Get doctor
        // ----------------------------------

        const doctor = await Doctor.findById(id)
            .populate(
                "user",
                "fullName username email role createdAt"
            )
            .lean();


        if (!doctor) {

            return res.status(404).json({
                success: false,
                message: "Doctor not found.",
            });

        }


        // ----------------------------------
        // Appointment statistics
        // ----------------------------------

        const totalAppointments =
            await Appointment.countDocuments({
                doctor: id,
            });


        const completedAppointments =
            await Appointment.countDocuments({
                doctor: id,
                status: "Completed",
            });


        // ----------------------------------
        // Unique patients treated
        // ----------------------------------

        const patientsResult =
            await Appointment.aggregate([

                {
                    $match: {
                        doctor: doctor._id,
                        status: "Completed",
                    },
                },

                {
                    $group: {
                        _id: "$patient",
                    },
                },

                {
                    $count: "total",
                },

            ]);


        const patientsTreated =
            patientsResult[0]?.total || 0;


        // ----------------------------------
        // Reviews
        // ----------------------------------

        const reviews =
            await Review.find({
                doctor: doctor._id,
            })
            .populate(
                "patient",
                "fullName username"
            )
            .sort({
                createdAt: -1,
            })
            .lean();


        // ----------------------------------
        // Rating statistics
        // ----------------------------------

        const ratingResult =
            await Review.aggregate([

                {
                    $match: {
                        doctor: doctor._id,
                    },
                },

                {
                    $group: {
                        _id: null,

                        averageRating: {
                            $avg: "$rating",
                        },

                        totalReviews: {
                            $sum: 1,
                        },
                    },
                },

            ]);


        const averageRating =
            ratingResult[0]?.averageRating || 0;

        const totalReviews =
            ratingResult[0]?.totalReviews || 0;


        // ----------------------------------
        // Response
        // ----------------------------------

        return res.status(200).json({

            success: true,

            doctor,

            stats: {

                totalAppointments,

                completedAppointments,

                patientsTreated,

                averageRating:
                    Number(averageRating.toFixed(1)),

                totalReviews,

            },

            reviews,

        });

    }

    catch (err) {

        console.error(
            "Admin doctor details error:",
            err
        );

        return res.status(500).json({

            success: false,

            message:
                "Failed to fetch doctor details.",

        });

    }

};

// ----------------------------------
// Delete doctor - Admin
// ----------------------------------

exports.deleteAdminDoctor = async (req, res) => {

    try {

        const { doctorId } = req.params;


        // -----------------------------
        // Validate doctor ID
        // -----------------------------

        if (!mongoose.Types.ObjectId.isValid(doctorId)) {

            return res.status(400).json({

                success: false,
                message: "Invalid doctor ID.",

            });

        }


        const doctor = await Doctor.findById(
            doctorId
        );


        // -----------------------------
        // Doctor not found
        // -----------------------------

        if (!doctor) {

            return res.status(404).json({

                success: false,
                message: "Doctor not found.",

            });

        }


        // -----------------------------
        // Delete appointments
        // -----------------------------

        await Appointment.deleteMany({
            doctor: doctor._id,
        });


        // -----------------------------
        // Delete reviews
        // -----------------------------

        await Review.deleteMany({
            doctor: doctor._id,
        });


        // -----------------------------
        // Delete doctor profile
        // -----------------------------

        await Doctor.findByIdAndDelete(
            doctor._id
        );


        // -----------------------------
        // Delete associated user
        // -----------------------------

        await User.findByIdAndDelete(
            doctor.user
        );


        return res.status(200).json({

            success: true,
            message: "Doctor removed successfully.",

        });

    }

    catch (err) {

        console.error(
            "Admin delete doctor error:",
            err
        );

        return res.status(500).json({

            success: false,
            message: "Failed to remove doctor.",

        });

    }

};