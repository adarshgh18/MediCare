import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, X } from "lucide-react";

import { AuthContext } from "../../context/AuthContext";
import api from "../../services/api";


function NotificationDropdown() {

    const navigate = useNavigate();

    const { user } = useContext(AuthContext);

    const [showNotifications, setShowNotifications] =
        useState(false);

    const [notifications, setNotifications] =
        useState([]);

    const [unreadCount, setUnreadCount] =
        useState(0);

    const notificationRef = useRef(null);


    // --------------------------------
    // Fetch notifications
    // --------------------------------

    const fetchNotifications = async () => {

        if (!user) return;

        try {

            const response =
                await api.get("/notifications");

            setNotifications(
                response.data.notifications || []
            );

            setUnreadCount(
                response.data.unreadCount || 0
            );

        } catch (error) {

            console.error(
                "Error fetching notifications:",
                error
            );

        }

    };


    useEffect(() => {

        fetchNotifications();

    }, [user]);


    // --------------------------------
    // Close dropdown when clicking outside
    // --------------------------------

    useEffect(() => {

        const handleClickOutside = (event) => {

            if (
                notificationRef.current &&
                !notificationRef.current.contains(
                    event.target
                )
            ) {

                setShowNotifications(false);

            }

        };

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () => {

            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );

        };

    }, []);


    // --------------------------------
    // Mark notification as read
    // --------------------------------

    const markAsRead = async (notification) => {

        try {

            if (!notification.isRead) {

                await api.patch(
                    `/notifications/${notification._id}/read`
                );

                setNotifications((prev) =>
                    prev.map((item) =>
                        item._id === notification._id
                            ? {
                                ...item,
                                isRead: true,
                            }
                            : item
                    )
                );

                setUnreadCount(
                    (prev) => Math.max(prev - 1, 0)
                );

            }

        } catch (error) {

            console.error(
                "Error marking notification as read:",
                error
            );

        }

    };


    // --------------------------------
    // Delete notification
    // --------------------------------

    const deleteNotification = async (
        notification
    ) => {

        try {

            await api.delete(
                `/notifications/${notification._id}`
            );

            setNotifications((prev) =>
                prev.filter(
                    (item) =>
                        item._id !== notification._id
                )
            );

            if (!notification.isRead) {

                setUnreadCount(
                    (prev) =>
                        Math.max(prev - 1, 0)
                );

            }

        } catch (error) {

            console.error(
                "Error deleting notification:",
                error
            );

        }

    };


    // --------------------------------
    // Notification click
    // --------------------------------

    const handleNotificationClick = async (
        notification
    ) => {

        await markAsRead(notification);

        setShowNotifications(false);

        if (user.role === "doctor") {

            navigate("/doctor/dashboard");

        } else {

            navigate("/patient/dashboard");

        }

    };


    // --------------------------------
    // Relative time
    // --------------------------------

    const getRelativeTime = (date) => {

        const now = new Date();

        const createdAt = new Date(date);

        const difference =
            Math.floor(
                (now - createdAt) / 1000
            );


        if (difference < 60) {

            return "Just now";

        }


        const minutes =
            Math.floor(difference / 60);

        if (minutes < 60) {

            return `${minutes} min ago`;

        }


        const hours =
            Math.floor(minutes / 60);

        if (hours < 24) {

            return `${hours} hr ago`;

        }


        const days =
            Math.floor(hours / 24);

        if (days < 7) {

            return `${days} day${days > 1 ? "s" : ""} ago`;

        }


        return createdAt.toLocaleDateString();

    };


    return (

        <div
            className="relative"
            ref={notificationRef}
        >

            {/* Notification Bell */}

            <button
                onClick={() =>
                    setShowNotifications(
                        !showNotifications
                    )
                }
                className="relative p-2 rounded-full hover:bg-blue-700 transition"
            >

                <Bell size={21} />


                {unreadCount > 0 && (

                    <span
                        className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                    >

                        {unreadCount > 9
                            ? "9+"
                            : unreadCount}

                    </span>

                )}

            </button>


            {/* Notification Dropdown */}

            {showNotifications && (

                <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-xl text-black border border-gray-100 z-50 overflow-hidden">

                    {/* Header */}

                    <div className="px-4 py-3 border-b">

                        <h3 className="font-semibold text-gray-800">

                            Notifications

                        </h3>


                        {unreadCount > 0 && (

                            <p className="text-xs text-gray-500 mt-0.5">

                                {unreadCount} unread

                            </p>

                        )}

                    </div>


                    {/* Notification list */}

                    <div className="max-h-96 overflow-y-auto">

                        {notifications.length === 0 ? (

                            <div className="px-4 py-10 text-center">

                                <Bell
                                    size={28}
                                    className="mx-auto text-gray-300 mb-2"
                                />

                                <p className="text-sm text-gray-500">

                                    No notifications yet.

                                </p>

                            </div>

                        ) : (

                            notifications.map(
                                (notification) => (

                                    <div
                                        key={notification._id}
                                        onClick={() =>
                                            handleNotificationClick(
                                                notification
                                            )
                                        }
                                        className={`w-full text-left px-4 py-3 border-b hover:bg-gray-50 transition cursor-pointer ${
                                            !notification.isRead
                                                ? "bg-blue-50/60"
                                                : "bg-white"
                                        }`}
                                    >

                                        <div className="flex gap-3">

                                            {/* Unread indicator */}

                                            <div className="pt-1.5">

                                                <span
                                                    className={`block w-2 h-2 rounded-full ${
                                                        notification.isRead
                                                            ? "bg-transparent"
                                                            : "bg-blue-600"
                                                    }`}
                                                />

                                            </div>


                                            {/* Content */}

                                            <div className="flex-1 min-w-0">

                                                <p className="text-sm font-semibold text-gray-800">

                                                    {
                                                        notification.title
                                                    }

                                                </p>


                                                <p className="text-xs text-gray-500 mt-1 leading-5">

                                                    {
                                                        notification.message
                                                    }

                                                </p>


                                                <p className="text-[11px] text-gray-400 mt-1.5">

                                                    {
                                                        getRelativeTime(
                                                            notification.createdAt
                                                        )
                                                    }

                                                </p>

                                            </div>


                                            {/* Delete */}

                                            <button
                                                type="button"
                                                onClick={(e) => {

                                                    e.stopPropagation();

                                                    deleteNotification(
                                                        notification
                                                    );

                                                }}
                                                className="flex-shrink-0 self-start p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition"
                                                title="Delete notification"
                                            >

                                                <X size={16} />

                                            </button>

                                        </div>

                                    </div>

                                )
                            )

                        )}

                    </div>

                </div>

            )}

        </div>

    );

}

export default NotificationDropdown;