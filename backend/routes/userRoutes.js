const express = require("express");

const router = express.Router();

const {
    getMyProfile,
    updateMyProfile,
} = require("../controllers/userController");

const isLoggedIn  = require("../middleware/isLoggedIn");


router.get(
    "/profile",
    isLoggedIn,
    getMyProfile
);


router.patch(
    "/profile",
    isLoggedIn,
    updateMyProfile
);


module.exports = router;