const express = require("express");
const router = express.Router();

const appointmentController = require("../controllers/appointmentController");

const wrapAsync = require("../utils/wrapAsync");

const isLoggedIn = require("../middleware/isLoggedIn");
const isPatient = require("../middleware/isPatient");
const isDoctor = require("../middleware/isDoctor");

router.post(
    "/",
    isLoggedIn,
    isPatient,
    wrapAsync(appointmentController.bookAppointment)
);

router.get(
    "/my",
    isLoggedIn,
    isPatient,
    wrapAsync(appointmentController.getMyAppointments)
);

router.get(
    "/doctor",
    isLoggedIn,
    isDoctor,
    wrapAsync(appointmentController.getDoctorAppointments)
);

router.get(
    "/:id",
    isLoggedIn,
    isPatient,
    wrapAsync(appointmentController.getAppointmentById)
);

router.patch(
    "/:id/cancel",
    isLoggedIn,
    isPatient,
    wrapAsync(appointmentController.cancelAppointment)
);

router.patch(
    "/:id/status",
    isLoggedIn,
    isDoctor,
    wrapAsync(appointmentController.updateAppointmentStatus)
);



module.exports = router;

