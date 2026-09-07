const express = require("express");

const router = express.Router();

const reviewController = require("../controllers/reviewController");

const wrapAsync = require("../utils/wrapAsync");

const isLoggedIn = require("../middleware/isLoggedIn");
const isPatient = require("../middleware/isPatient");


router.post(
    "/",
    isLoggedIn,
    isPatient,
    wrapAsync(reviewController.createReview)
);

router.get(
    "/my",
    isLoggedIn,
    isPatient,
    wrapAsync(reviewController.getMyReviews)
);

router.get(
    "/doctor/:doctorId",
    wrapAsync(reviewController.getDoctorReviews)
);

module.exports = router;