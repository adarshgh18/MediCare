const Appointment = require("../models/appointment");
const Doctor = require("../models/doctor");

const Notification = require("../models/notification");

exports.bookAppointment = async (req, res) => {

    const {
        doctorId,
        appointmentDate,
        timeSlot,
        reason,
    } = req.body;

    // Check whether doctor exists
    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
        return res.status(404).json({
            success: false,
            message: "Doctor not found.",
        });
    }

    const selectedDate = new Date(appointmentDate);

    selectedDate.setHours(0, 0, 0, 0);

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {

        return res.status(400).json({

            success: false,

            message: "Past appointments cannot be booked.",

        });

    }

    // Check whether doctor is available on this day

    const appointmentDay = new Date(
        appointmentDate
    ).toLocaleDateString("en-US", {
        weekday: "long",
    });


    const dayAvailability = doctor.availability.find(
        (item) => item.day === appointmentDay
    );


    if (!dayAvailability) {

        return res.status(400).json({
            success: false,
            message:
                "Doctor is not available on this day.",
        });

    }


    // Check whether requested slot exists

    if ( !dayAvailability.slots.includes( timeSlot ) ) {

        return res.status(400).json({
            success: false,
            message:
                "This time slot is not available for the doctor.",
        });

    }

    //Before creating an appointment,check whether another appointment already exists 
    const existingAppointment = await Appointment.findOne({
        doctor: doctorId,
        appointmentDate,
        timeSlot,
        status: {
            $in: ["Pending", "Confirmed"],
        },
    });

    if (existingAppointment) {
        return res.status(400).json({
            success: false,
            message: "This time slot is already booked.",
        });
    }

    // Create appointment
    const appointment = await Appointment.create({

        patient: req.user._id,

        doctor: doctorId,

        appointmentDate,

        timeSlot,

        reason,

    });

    await Notification.create({
        recipient: doctor.user,
        title: "New Appointment",
        message: `You have a new appointment request for ${timeSlot}.`,
        type: "Appointment",
        relatedAppointment: appointment._id,
    });

    res.status(201).json({
        success: true,
        message: "Appointment booked successfully.",
        appointment,
    });

};

exports.getMyAppointments = async (req, res) => {

    const appointments = await Appointment.find({
        patient: req.user._id,
    })
        .populate({
            path: "doctor",
            populate: {
                path: "user",
                select: "fullName email",
            },
        })
        .sort({ appointmentDate: 1 });

    res.status(200).json({
        success: true,
        count: appointments.length,
        appointments,
    });

};

exports.getAppointmentById = async (req, res) => {

    const appointment = await Appointment.findOne({
        _id: req.params.id,
        patient: req.user._id,
    })
        .populate({
            path: "doctor",
            populate: {
                path: "user",
                select: "fullName email",
            },
        });

    if (!appointment) {

        return res.status(404).json({
            success: false,
            message: "Appointment not found.",
        });

    }

    res.status(200).json({
        success: true,
        appointment,
    });

};

exports.getDoctorAppointments = async (req, res) => {

    const doctor = await Doctor.findOne({
        user: req.user._id,
    });

    if (!doctor) {
        return res.status(404).json({
            success: false,
            message: "Doctor profile not found.",
        });
    }

    const appointments = await Appointment.find({
        doctor: doctor._id,
    })
        .populate("patient", "fullName email username")
        .sort({ appointmentDate: 1 });

    res.status(200).json({
        success: true,
        count: appointments.length,
        appointments,
    });

};

exports.updateAppointmentStatus = async (req, res) => {

    const doctor = await Doctor.findOne({
        user: req.user._id,
    });

    if (!doctor) {

        return res.status(404).json({
            success: false,
            message: "Doctor profile not found.",
        });

    }


    const appointment = await Appointment.findOne({
        _id: req.params.id,
        doctor: doctor._id,
    });

    if (!appointment) {

        return res.status(404).json({
            success: false,
            message: "Appointment not found.",
        });

    }


    const newStatus = req.body.status;


    const allowedStatuses = [
        "Confirmed",
        "Cancelled",
        "Completed",
    ];


    if (!allowedStatuses.includes(newStatus)) {

        return res.status(400).json({
            success: false,
            message: "Invalid appointment status.",
        });

    }

    // ----------------------------------
    // Validate status transition
    // ----------------------------------

    const currentStatus = appointment.status;

    const validTransition =
        (currentStatus === "Pending" &&
            (newStatus === "Confirmed" ||
                newStatus === "Cancelled"))

        ||

        (currentStatus === "Confirmed" &&
            (newStatus === "Completed" ||
                newStatus === "Cancelled"));


    if (!validTransition) {

        return res.status(400).json({

            success: false,

            message:
                `Cannot change appointment status from ${currentStatus} to ${newStatus}.`,

        });

    }

    appointment.status = newStatus;
    await appointment.save();

    // Get doctor's name

    const doctorUser = await Doctor.findById(
        doctor._id
    ).populate("user", "fullName");


    const doctorName =
        doctorUser.user.fullName;

    // Create notification for patient

    let notificationTitle = "";
    let notificationMessage = "";


    if (newStatus === "Confirmed") {

        notificationTitle =
            "Appointment Confirmed";

        notificationMessage =
            `Your appointment with ${doctorName} has been confirmed for ${appointment.timeSlot}.`;
    }


    else if (newStatus === "Cancelled") {

        notificationTitle =
            "Appointment Cancelled";

        notificationMessage =
            `Your appointment with ${doctorName} has been cancelled.`;

    }

    else if (newStatus === "Completed") {

        notificationTitle =
            "Appointment Completed";

        notificationMessage =
            `Your appointment with ${doctorName} has been marked as completed.`;

    }

    await Notification.create({

        recipient: appointment.patient,

        title: notificationTitle,

        message: notificationMessage,

        type: "Appointment",

        relatedAppointment: appointment._id,

    });

    res.status(200).json({

        success: true,

        message:
            "Appointment status updated.",

        appointment,

    });

};


exports.cancelAppointment = async (req, res) => {

    const appointment = await Appointment.findOne({

        _id: req.params.id,
        patient: req.user._id,

    });


    if (!appointment) {

        return res.status(404).json({

            success: false,
            message: "Appointment not found.",

        });
    }


    if (appointment.status !== "Pending") {

        return res.status(400).json({

            success: false,
            message:
                "Only pending appointments can be cancelled.",

        });

    }

    appointment.status = "Cancelled";
    await appointment.save();

    // Notify doctor

    const doctor = await Doctor.findById(
        appointment.doctor
    );

    if (doctor) {

        await Notification.create({

            recipient: doctor.user,
            title: "Appointment Cancelled",
            message:
                `A patient has cancelled the appointment scheduled for ${appointment.timeSlot}.`,

            type: "Appointment",
            relatedAppointment: appointment._id,
        });
    }


    res.status(200).json({

        success: true,
        message: "Appointment cancelled successfully.",
        appointment,

    });
};