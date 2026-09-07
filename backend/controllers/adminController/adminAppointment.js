const User = require("../../models/user");
const Doctor = require("../../models/doctor");
const Appointment = require("../../models/appointment");
const mongoose = require("mongoose");

// ----------------------------------
// Get all appointments - Admin
// Pagination + Filtering
// ----------------------------------

exports.getAdminAppointments = async (req, res) => {

    try {

        // -----------------------------
        // Pagination
        // -----------------------------

        const page = Math.max(
            parseInt(req.query.page) || 1,
            1
        );

        const limit = Math.min(
            parseInt(req.query.limit) || 10,
            50
        );

        const skip = (page - 1) * limit;


        // -----------------------------
        // Filters
        // -----------------------------

        const { status, date, search } = req.query;

        const filter = {};


        // -----------------------------
        // Status filter
        // -----------------------------

        if (status && status !== "All") {

            filter.status = status;

        }


        // -----------------------------
        // Date filter
        // -----------------------------

        if (date && date !== "all") {

            const now = new Date();

            // Start of today
            const startOfToday = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate()
            );

            // Start of tomorrow
            const startOfTomorrow = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate() + 1
            );


            if (date === "today") {

                filter.appointmentDate = {
                    $gte: startOfToday,
                    $lt: startOfTomorrow,
                };

            }

            else if (date === "upcoming") {

                filter.appointmentDate = {
                    $gte: startOfTomorrow,
                };

            }

            else if (date === "past") {

                filter.appointmentDate = {
                    $lt: startOfToday,
                };

            }

        }

        // -----------------------------
        // Get appointments
        // -----------------------------

        let query = Appointment.find(filter);

        // -----------------------------
        // Search patient / doctor
        // -----------------------------

        if (search && search.trim()) {

            const searchRegex = new RegExp(
                search.trim(),
                "i"
            );

            const patients = await User.find({
                role: "patient",
                $or: [
                    { fullName: searchRegex },
                    { username: searchRegex },
                    { email: searchRegex },
                ],
            }).select("_id");

            const doctors = await Doctor.find({})
                .populate({
                    path: "user",
                    match: {
                        $or: [
                            { fullName: searchRegex },
                            { username: searchRegex },
                            { email: searchRegex },
                        ],
                    },
                    select: "_id",
                });

            const patientIds = patients.map(
                (patient) => patient._id
            );

            const doctorIds = doctors
                .filter((doctor) => doctor.user)
                .map((doctor) => doctor._id);

            filter.$or = [
                {
                    patient: {
                        $in: patientIds,
                    },
                },
                {
                    doctor: {
                        $in: doctorIds,
                    },
                },
            ];

            query = Appointment.find(filter);

        }

        // -----------------------------
        // Total appointments
        // -----------------------------

        const totalAppointments =
            await Appointment.countDocuments(filter);

        // -----------------------------
        // Paginated appointments
        // -----------------------------

        const appointments = await query
            .populate(
                "patient",
                "fullName username email"
            )
            .populate({
                path: "doctor",
                populate: {
                    path: "user",
                    select: "fullName username email",
                },
            })
            .sort({
                appointmentDate: -1,
            })
            .skip(skip)
            .limit(limit);

        // -----------------------------
        // Pagination info
        // -----------------------------

        const totalPages = Math.ceil(
            totalAppointments / limit
        );

        // -----------------------------
        // Response
        // -----------------------------

        return res.status(200).json({

            success: true,
            appointments,
            totalAppointments,
            currentPage: page,
            totalPages,

        });

    }

    catch (err) {

        console.error(
            "Admin appointments error:",
            err
        );

        return res.status(500).json({

            success: false,
            message:
                "Failed to fetch appointments.",

        });

    }

};

// ----------------------------------
// Delete appointment - Admin
// ----------------------------------

exports.deleteAdminAppointment = async (req, res) => {

    try {
        const { appointmentId } = req.params;

        // Validate appointment ID

        if (!mongoose.Types.ObjectId.isValid(appointmentId)) {

            return res.status(400).json({

                success: false,
                message: "Invalid appointment ID.",

            });

        }

        // Find appointment

        const appointment =
            await Appointment.findById(appointmentId);


        // Appointment not found

        if (!appointment) {

            return res.status(404).json({

                success: false,
                message: "Appointment not found.",

            });

        }


        // Delete appointment

        await Appointment.findByIdAndDelete(
            appointmentId
        );


        return res.status(200).json({

            success: true,
            message: "Appointment removed successfully.",

        });

    }

    catch (err) {

        console.error(
            "Admin delete appointment error:",
            err
        );

        return res.status(500).json({

            success: false,
            message: "Failed to remove appointment.",

        });

    }

};