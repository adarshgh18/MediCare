const Notification = require("../models/notification");


// Get notifications for logged-in user

exports.getMyNotifications = async (req, res) => {

    try {

        const notifications =
            await Notification.find({
                recipient: req.user._id,
            })
                .populate(
                    "relatedAppointment",
                    "appointmentDate timeSlot status"
                )
                .sort({
                    createdAt: -1,
                });

        const unreadCount =
            await Notification.countDocuments({
                recipient: req.user._id,
                isRead: false,
            });


        res.status(200).json({

            success: true,

            notifications,

            unreadCount,

        });

    } catch (err) {

        res.status(500).json({

            success: false,

            message: err.message,

        });

    }

};


// Mark one notification as read

exports.markAsRead = async (req, res) => {

    try {

        const notification =
            await Notification.findOneAndUpdate(

                {
                    _id: req.params.id,

                    recipient: req.user._id,
                },

                {
                    isRead: true,
                },

                {
                    new: true,
                }
            );


        if (!notification) {

            return res.status(404).json({

                success: false,

                message:
                    "Notification not found.",

            });

        }


        res.status(200).json({

            success: true,

            notification,

        });

    } catch (err) {

        res.status(500).json({

            success: false,

            message: err.message,

        });

    }

};


exports.deleteNotification = async (req, res) => {

    try {

        const notification =
            await Notification.findOneAndDelete({

                _id: req.params.id,

                recipient: req.user._id,

            });


        if (!notification) {

            return res.status(404).json({

                success: false,

                message: "Notification not found.",

            });

        }


        res.status(200).json({

            success: true,

            message: "Notification deleted successfully.",

        });

    } catch (err) {

        res.status(500).json({

            success: false,

            message: err.message,

        });

    }

};