import {
    ClockAlert,
    CircleCheck,
    CircleX,
    CheckCircle2,
} from "lucide-react";

import {
    FaHourglassHalf,
    FaClipboardCheck,
    FaCheckCircle,
    FaTimesCircle,
} from "react-icons/fa";


const statusConfig = {
    patient: {
        Pending: {
            className:
                "bg-amber-50 text-amber-700 border-amber-200",
            icon: <ClockAlert size={13} />,
        },

        Confirmed: {
            className:
                "bg-emerald-50 text-emerald-700 border-emerald-200",
            icon: <CircleCheck size={13} />,
        },

        Cancelled: {
            className:
                "bg-red-50 text-red-600 border-red-200",
            icon: <CircleX size={13} />,
        },

        Completed: {
            className:
                "bg-blue-50 text-blue-700 border-blue-200",
            icon: <CheckCircle2 size={13} />,
        },
    },


    doctor: {
        Pending: {
            className:
                "bg-amber-50 text-amber-700 border-amber-200",
            icon: <FaHourglassHalf />,
        },

        Confirmed: {
            className:
                "bg-blue-50 text-blue-700 border-blue-200",
            icon: <FaClipboardCheck />,
        },

        Completed: {
            className:
                "bg-emerald-50 text-emerald-700 border-emerald-200",
            icon: <FaCheckCircle />,
        },

        Cancelled: {
            className:
                "bg-red-50 text-red-600 border-red-200",
            icon: <FaTimesCircle />,
        },
    },


    details: {
        Pending: {
            className:
                "bg-yellow-50 text-yellow-700 border-yellow-200",
            icon: <ClockAlert size={16} />,
        },

        Confirmed: {
            className:
                "bg-green-50 text-green-700 border-green-200",
            icon: <CircleCheck size={16} />,
        },

        Cancelled: {
            className:
                "bg-red-50 text-red-600 border-red-200",
            icon: <CircleX size={16} />,
        },

        Completed: {
            className:
                "bg-blue-50 text-blue-700 border-blue-200",
            icon: <CircleCheck size={16} />,
        },
    },


    admin: {
        Confirmed: {
            className:
                "bg-green-50 text-green-600",
            icon: null,
        },

        Completed: {
            className:
                "bg-blue-50 text-blue-600",
            icon: null,
        },

        Cancelled: {
            className:
                "bg-red-50 text-red-600",
            icon: null,
        },

        Pending: {
            className:
                "bg-amber-50 text-amber-600",
            icon: null,
        },
    },
};


const StatusBadge = ({
    status,
    variant = "patient",
    className = "",
}) => {

    const config =
        statusConfig[variant]?.[status] ||
        {
            className:
                "bg-gray-50 text-gray-600 border-gray-200",
            icon: null,
        };


    return (
        <span
            className={`${config.className} ${className}`}
        >
            {config.icon}
            {status}
        </span>
    );
};


export default StatusBadge;