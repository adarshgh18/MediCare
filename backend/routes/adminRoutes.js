const express = require("express");

const router = express.Router();

const adminDashboard = require("../controllers/adminController/adminDashboard");
const adminDoctor = require("../controllers/adminController/adminDoctor");
const adminPatient = require("../controllers/adminController/adminPatient");
const adminAppointment = require("../controllers/adminController/adminAppointment");

const isLoggedIn = require("../middleware/isLoggedIn");

const isAdmin = require("../middleware/isAdmin");


// ----------------------------------
// Admin Dashboard
// ----------------------------------

router.get(
    "/dashboard",
    isLoggedIn,
    isAdmin,
    adminDashboard.getAdminDashboard
);

router.get(
    "/doctors",
    isLoggedIn,
    isAdmin,
    adminDoctor.getAdminDoctors
);


router.get(
    "/doctors/:id",
    isLoggedIn,
    isAdmin,
    adminDoctor.getAdminDoctorById
);

router.delete(
    "/doctors/:doctorId",
    isLoggedIn,
    isAdmin,
    adminDoctor.deleteAdminDoctor
);


router.get(
    "/patients",
    isLoggedIn,
    isAdmin,
    adminPatient.getAdminPatients
);

router.get(
    "/patients/:patientId",
    isLoggedIn,
    isAdmin,
    adminPatient.getAdminPatientById
);

router.delete(
    "/patients/:patientId",
    isLoggedIn,
    isAdmin,
    adminPatient.deleteAdminPatient
);

router.get(
    "/appointments",
    isLoggedIn,
    isAdmin,
    adminAppointment.getAdminAppointments
);


router.delete(
    "/appointments/:appointmentId",
    isLoggedIn,
    isAdmin,
    adminAppointment.deleteAdminAppointment
);


module.exports = router;