const express = require("express");
const router = express.Router();

const doctorController = require("../controllers/doctorController");

const isLoggedIn = require("../middleware/isLoggedIn");
const isDoctor = require("../middleware/isDoctor");
const validateDoctor = require("../middleware/doctorValidation");

const wrapAsync = require("../utils/wrapAsync");

router.post(
    "/",
    isLoggedIn,
    isDoctor,
    validateDoctor,
    wrapAsync(doctorController.createDoctorProfile)
);

router.get(
    "/",
    wrapAsync(doctorController.getAllDoctors)
);

router.get(
    "/me",
    isLoggedIn,
    isDoctor,
    wrapAsync(doctorController.getMyProfile)
);

router.put(
    "/me",
    isLoggedIn,
    isDoctor,
    validateDoctor,
    wrapAsync(doctorController.updateMyProfile)
);

router.put(
    "/availability",
    isLoggedIn,
    isDoctor,
    wrapAsync(doctorController.updateAvailability)
);

router.get(
    "/:id",
    wrapAsync(doctorController.getDoctorById)
);

router.get(
    "/:id/availability",
    wrapAsync(doctorController.getDoctorAvailability)
);


module.exports = router;