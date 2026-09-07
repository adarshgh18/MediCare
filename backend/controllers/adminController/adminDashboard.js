const User = require("../../models/user");
const Doctor = require("../../models/doctor");
const Appointment = require("../../models/appointment");

exports.getAdminDashboard = async (req, res) => {

    try {

        // =====================================================
        // BASIC COUNTS
        // =====================================================

        const totalPatients = await User.countDocuments({
            role: "patient",
        });

        const totalDoctors = await User.countDocuments({
            role: "doctor",
        });

        const totalAppointments =
            await Appointment.countDocuments();


        // =====================================================
        // APPOINTMENT STATUS
        // =====================================================

        const [
            pendingAppointments,
            confirmedAppointments,
            completedAppointments,
            cancelledAppointments,
        ] = await Promise.all([

            Appointment.countDocuments({
                status: "Pending",
            }),

            Appointment.countDocuments({
                status: "Confirmed",
            }),

            Appointment.countDocuments({
                status: "Completed",
            }),

            Appointment.countDocuments({
                status: "Cancelled",
            }),

        ]);


        // =====================================================
        // TODAY'S DATE RANGE
        // =====================================================

        const now = new Date();

        const startOfToday = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate()
        );

        const startOfTomorrow = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() + 1
        );


        // =====================================================
        // TODAY'S APPOINTMENTS
        // =====================================================

        const todaysAppointments =
            await Appointment.find({

                appointmentDate: {
                    $gte: startOfToday,
                    $lt: startOfTomorrow,
                },

            })
                .populate(
                    "patient",
                    "fullName username"
                )
                .populate({

                    path: "doctor",

                    populate: {

                        path: "user",

                        select:
                            "fullName username",

                    },

                })
                .sort({
                    appointmentDate: 1,
                })
                .limit(20);


        // =====================================================
        // LAST 7 DAYS APPOINTMENT TREND
        // =====================================================

        const sevenDaysAgo = new Date(
            startOfToday
        );

        sevenDaysAgo.setDate(
            sevenDaysAgo.getDate() - 6
        );


        const trendAppointments =
            await Appointment.aggregate([

                {
                    $match: {

                        appointmentDate: {
                            $gte: sevenDaysAgo,
                            $lt: startOfTomorrow,
                        },

                    },

                },

                {
                    $group: {

                        _id: {

                            $dateToString: {

                                format: "%Y-%m-%d",

                                date: "$appointmentDate",

                                timezone:
                                    "Asia/Kolkata",

                            },

                        },

                        count: {
                            $sum: 1,
                        },

                    },

                },

                {
                    $sort: {
                        _id: 1,
                    },

                },

            ]);


        // =====================================================
        // FORMAT 7 DAYS
        // =====================================================

        const appointmentTrend = [];

        for (let i = 0; i < 7; i++) {

            const date = new Date(
                sevenDaysAgo
            );

            date.setDate(
                date.getDate() + i
            );


            const year =
                date.getFullYear();

            const month =
                String(
                    date.getMonth() + 1
                ).padStart(2, "0");

            const day =
                String(
                    date.getDate()
                ).padStart(2, "0");


            const dateKey =
                `${year}-${month}-${day}`;


            const found =
                trendAppointments.find(
                    (item) =>
                        item._id === dateKey
                );


            appointmentTrend.push({

                date: dateKey,

                day: date.toLocaleDateString(
                    "en-US",
                    {
                        weekday: "short",
                    }
                ),

                count:
                    found?.count || 0,

            });

        }


        // =====================================================
        // TOP SPECIALIZATIONS
        // =====================================================

        const specializationData =
            await Doctor.aggregate([

                {
                    $match: {

                        specialization: {
                            $exists: true,
                            $ne: "",
                        },

                    },

                },

                {
                    $group: {

                        _id:
                            "$specialization",

                        count: {
                            $sum: 1,
                        },

                    },

                },

                {
                    $sort: {
                        count: -1,
                    },

                },

            ]);


        const topSpecializations =
            specializationData
                .slice(0, 4)
                .map((item) => ({

                    name: item._id,

                    count: item.count,

                }));


        const topSpecializationCount =
            topSpecializations.reduce(
                (sum, item) =>
                    sum + item.count,
                0
            );


        const othersCount =
            Math.max(
                totalDoctors -
                    topSpecializationCount,
                0
            );


        // =====================================================
        // RECENT APPOINTMENTS
        // =====================================================

        const recentAppointments =
            await Appointment.find({})

                .populate(
                    "patient",
                    "fullName username"
                )

                .populate({

                    path: "doctor",

                    populate: {

                        path: "user",

                        select:
                            "fullName username",

                    },

                })

                .sort({
                    createdAt: -1,
                })

                .limit(6);


        // =====================================================
        // NEW REGISTRATIONS
        // =====================================================

        const newRegistrations =
            await User.find({

                role: "patient",

            })

                .select(
                    "fullName username email role createdAt"
                )

                .sort({
                    createdAt: -1,
                })

                .limit(4);


        // =====================================================
        // PLATFORM INSIGHTS
        // =====================================================

        const completedRate =
            totalAppointments > 0
                ? Math.round(
                    (
                        completedAppointments /
                        totalAppointments
                    ) * 100
                )
                : 0;


        const cancellationRate =
            totalAppointments > 0
                ? Math.round(
                    (
                        cancelledAppointments /
                        totalAppointments
                    ) * 100
                )
                : 0;


        const pendingRate =
            totalAppointments > 0
                ? Math.round(
                    (
                        pendingAppointments /
                        totalAppointments
                    ) * 100
                )
                : 0;


        const doctorPatientRatio =
            totalDoctors > 0
                ? Math.round(
                    totalPatients /
                    totalDoctors
                )
                : 0;


        // =====================================================
        // RESPONSE
        // =====================================================

        return res.status(200).json({

            success: true,

            stats: {

                totalPatients,

                totalDoctors,

                totalAppointments,

                appointments: {

                    pending:
                        pendingAppointments,

                    confirmed:
                        confirmedAppointments,

                    completed:
                        completedAppointments,

                    cancelled:
                        cancelledAppointments,

                },

                appointmentTrend,

                todaysAppointments,

                topSpecializations,

                othersSpecialization: {

                    name: "Others",

                    count: othersCount,

                },

                recentAppointments,

                newRegistrations,

                platformInsights: {

                    completedRate,

                    cancellationRate,

                    pendingRate,

                    doctorPatientRatio,

                },

            },

        });

    }

    catch (error) {

        console.error(
            "Admin dashboard error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to load admin dashboard.",

        });

    }

};