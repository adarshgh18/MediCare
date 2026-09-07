const express = require("express");

const router = express.Router();

const {
    getMyNotifications,
    markAsRead,
    deleteNotification,
} = require("../controllers/notificationController");

const isLoggedIn = require("../middleware/isLoggedIn");

router.get(
    "/",
    isLoggedIn,
    getMyNotifications
);


router.patch(
    "/:id/read",
    isLoggedIn,
    markAsRead
);


router.delete(
    "/:id",
    isLoggedIn,
    deleteNotification
);

module.exports = router;