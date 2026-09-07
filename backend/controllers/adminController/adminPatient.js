const mongoose = require("mongoose");
const User = require("../../models/user");
const Appointment = require("../../models/appointment");

exports.getAdminPatients = async (req, res) => {

    try {

        const page = Math.max(
            parseInt(req.query.page) || 1,
            1
        );

        const limit = Math.min(
            parseInt(req.query.limit) || 9,
            50
        );

        const search = req.query.search?.trim() || "";


        // ----------------------------------
        // Search condition
        // ----------------------------------

        const query = {
            role: "patient",
        };


        if (search) {

            query.$or = [

                {
                    fullName: {
                        $regex: search,
                        $options: "i",
                    },
                },

                {
                    username: {
                        $regex: search,
                        $options: "i",
                    },
                },

            ];

        }


        // ----------------------------------
        // Pagination
        // ----------------------------------

        const skip = (page - 1) * limit;


        const totalPatients =
            await User.countDocuments(query);


        const patients = await User.find(
            query,
            "fullName username email role createdAt"
        )
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);


        const totalPages = Math.ceil(
            totalPatients / limit
        );


        return res.status(200).json({

            success: true,

            count: patients.length,

            totalPatients,

            currentPage: page,

            totalPages,

            patients,

        });

    }

    catch (err) {

        console.error(
            "Admin patients error:",
            err
        );

        return res.status(500).json({

            success: false,

            message: "Failed to fetch patients.",

        });

    }

};

// ----------------------------------
// Get single patient - Admin
// ----------------------------------

exports.getAdminPatientById = async (req, res) => {

    try {

        const patient = await User.findOne(
            {
                _id: req.params.patientId,
                role: "patient",
            },
            "fullName username email role createdAt"
        );

        if (!patient) {

            return res.status(404).json({

                success: false,
                message: "Patient not found.",

            });

        }


        return res.status(200).json({

            success: true,
            patient,

        });

    }

    catch (err) {

        console.error(
            "Admin patient details error:",
            err
        );

        return res.status(500).json({

            success: false,
            message: "Failed to fetch patient details.",

        });

    }

};

// ----------------------------------
// Delete patient - Admin
// ----------------------------------

exports.deleteAdminPatient = async (req, res) => {

    try {

        const { patientId } = req.params;


        // -----------------------------
        // Validate patient ID
        // -----------------------------

        if (!mongoose.Types.ObjectId.isValid(patientId)) {

            return res.status(400).json({

                success: false,
                message: "Invalid patient ID.",

            });

        }


        // -----------------------------
        // Find patient
        // -----------------------------

        const patient = await User.findOne({
            _id: patientId,
            role: "patient",
        });


        // -----------------------------
        // Patient not found
        // -----------------------------

        if (!patient) {

            return res.status(404).json({

                success: false,
                message: "Patient not found.",

            });

        }


        // -----------------------------
        // Delete patient's appointments
        // -----------------------------

        await Appointment.deleteMany({
            patient: patient._id,
        });


        // -----------------------------
        // Delete patient account
        // -----------------------------

        await User.findByIdAndDelete(
            patient._id
        );


        return res.status(200).json({

            success: true,
            message: "Patient removed successfully.",

        });

    }

    catch (err) {

        console.error(
            "Admin delete patient error:",
            err
        );

        return res.status(500).json({

            success: false,
            message: "Failed to remove patient.",

        });

    }

};