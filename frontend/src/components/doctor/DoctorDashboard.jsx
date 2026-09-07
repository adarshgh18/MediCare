import {
    useEffect,
    useMemo,
    useState,
    useContext,
} from "react";

import { useNavigate } from "react-router-dom";

import api from "../../services/api";

import { AuthContext } from "../../context/AuthContext";
import Pagination from "../common/Pagination";
import StatusBadge from "../appointment/StatusBadge";

import {
    FaStethoscope,
    FaUser,
    FaEnvelope,
    FaCalendarAlt,
    FaClock,
    FaCheckCircle,
    FaTimesCircle,
    FaHourglassHalf,
    FaClipboardCheck,
} from "react-icons/fa";


function DoctorDashboard() {

    const { user } = useContext(AuthContext);

    const [appointments, setAppointments] = useState([]);

    const [filter, setFilter] = useState("All");
    const [loading, setLoading] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);
    const appointmentsPerPage = 10;

    const navigate = useNavigate();


    // =========================
    // FETCH APPOINTMENTS
    // =========================

    const fetchAppointments = async () => {

        try {

            const response = await api.get(
                "/appointments/doctor"
            );

            setAppointments(
                response.data.appointments || []
            );

        }

        catch (err) {

            console.log(err);

        }

        finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        fetchAppointments();

    }, []);


    // =========================
    // UPDATE APPOINTMENT STATUS
    // =========================

    const updateStatus = async (
        appointmentId,
        status
    ) => {

        let message = "";

        if (status === "Confirmed") {

            message =
                "Confirm this appointment?";

        }

        else if (status === "Completed") {

            message =
                "Mark this appointment as completed?";

        }

        else if (status === "Cancelled") {

            message =
                "Cancel this appointment?";

        }


        if (
            message &&
            !window.confirm(message)
        ) {

            return;

        }


        try {

            await api.patch(
                `/appointments/${appointmentId}/status`,
                {
                    status,
                }
            );

            await fetchAppointments();

        }

        catch (err) {

            console.log(err);

        }

    };


    // =========================
    // DATE HELPERS
    // =========================

    const getDateKey = (date) => {

        const d = new Date(date);

        return `${d.getFullYear()}-${String(
            d.getMonth() + 1
        ).padStart(2, "0")}-${String(
            d.getDate()
        ).padStart(2, "0")}`;

    };


    const todayKey = getDateKey(
        new Date()
    );


    const isToday = (appointment) => {

        return (
            getDateKey(
                appointment.appointmentDate
            ) === todayKey
        );

    };


    // =========================
    // NEXT 7 DAYS
    // =========================

    const isUpcoming = (appointment) => {

        if (
            appointment.status !== "Pending" &&
            appointment.status !== "Confirmed"
        ) {

            return false;

        }


        const appointmentDate =
            new Date(
                appointment.appointmentDate
            );

        const today = new Date();

        today.setHours(
            0,
            0,
            0,
            0
        );


        const sevenDaysLater =
            new Date(today);

        sevenDaysLater.setDate(
            sevenDaysLater.getDate() + 7
        );

        sevenDaysLater.setHours(
            23,
            59,
            59,
            999
        );


        appointmentDate.setHours(
            0,
            0,
            0,
            0
        );


        return (
            appointmentDate > today &&
            appointmentDate <= sevenDaysLater
        );

    };


    // =========================
    // STATISTICS
    // =========================

    const totalAppointments =
        appointments.length;


    const todayAppointments =
        appointments.filter(
            (appointment) =>
                isToday(appointment)
        ).length;


    const pendingAppointments =
        appointments.filter(
            (appointment) =>
                appointment.status ===
                "Pending"
        ).length;


    const confirmedAppointments =
        appointments.filter(
            (appointment) =>
                appointment.status ===
                "Confirmed"
        ).length;


    const completedAppointments =
        appointments.filter(
            (appointment) =>
                appointment.status ===
                "Completed"
        ).length;


    // =========================
    // TODAY'S APPOINTMENTS
    // =========================

    const todaysAppointments =
        appointments
            .filter(isToday)
            .sort(
                (a, b) =>
                    new Date(
                        a.appointmentDate
                    ) -
                    new Date(
                        b.appointmentDate
                    )
            );


    // =========================
    // UPCOMING APPOINTMENTS
    // =========================

    const upcomingAppointments =
        appointments
            .filter(isUpcoming)
            .sort(
                (a, b) =>
                    new Date(
                        a.appointmentDate
                    ) -
                    new Date(
                        b.appointmentDate
                    )
            );


    // =========================
    // FILTERED APPOINTMENTS
    // =========================

    const filteredAppointments =
        useMemo(() => {

            if (filter === "All") {

                return appointments;

            }


            return appointments.filter(
                (appointment) =>
                    appointment.status ===
                    filter
            );

        }, [
            appointments,
            filter,
        ]);

    const totalPages = Math.ceil(
        filteredAppointments.length / appointmentsPerPage
    );

    const paginatedAppointments = filteredAppointments.slice(
        (currentPage - 1) * appointmentsPerPage,
        currentPage * appointmentsPerPage
    );


    // =========================
    // FORMAT DATE
    // =========================

    const formatDate = (date) => {

        return new Date(
            date
        ).toLocaleDateString(
            "en-GB",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );

    };


    const formatTodayDate = () => {

        return new Date()
            .toLocaleDateString(
                "en-GB",
                {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                }
            );

    };


    // =========================
    // PATIENT INITIALS
    // =========================

    const getPatientInitials = (
        name
    ) => {

        if (!name) {

            return "P";

        }


        return name
            .split(" ")
            .map(
                (part) =>
                    part[0]
            )
            .join("")
            .slice(0, 2)
            .toUpperCase();

    };


    // =========================
    // ACTION BUTTONS
    // =========================

    const renderActions = (
        appointment
    ) => {

        if (
            appointment.status !==
                "Pending" &&
            appointment.status !==
                "Confirmed"
        ) {

            return (
                <span className="
                    text-xs
                    text-gray-400
                ">

                    —

                </span>
            );

        }


        return (

            <div className="
                flex
                items-center
                justify-start
                gap-2
            ">

                {/* CONFIRM */}

                {appointment.status ===
                    "Pending" && (

                    <button
                        onClick={() =>
                            updateStatus(
                                appointment._id,
                                "Confirmed"
                            )
                        }
                        title="Confirm Appointment"
                        aria-label="Confirm Appointment"
                        className="
                            w-9
                            h-9
                            rounded-lg
                            bg-blue-50
                            text-blue-600
                            border
                            border-blue-100
                            flex
                            items-center
                            justify-center
                            hover:bg-blue-600
                            hover:text-white
                            transition
                        "
                    >

                        <FaCheckCircle
                            size={15}
                        />

                    </button>

                )}


                {/* COMPLETE */}

                {appointment.status ===
                    "Confirmed" && (

                    <button
                        onClick={() =>
                            updateStatus(
                                appointment._id,
                                "Completed"
                            )
                        }
                        title="Mark as Completed"
                        aria-label="Mark as Completed"
                        className="
                            w-9
                            h-9
                            rounded-lg
                            bg-emerald-50
                            text-emerald-600
                            border
                            border-emerald-100
                            flex
                            items-center
                            justify-center
                            hover:bg-emerald-600
                            hover:text-white
                            transition
                        "
                    >

                        <FaClipboardCheck
                            size={15}
                        />

                    </button>

                )}


                {/* CANCEL */}

                <button
                    onClick={() =>
                        updateStatus(
                            appointment._id,
                            "Cancelled"
                        )
                    }
                    title="Cancel Appointment"
                    aria-label="Cancel Appointment"
                    className="
                        w-9
                        h-9
                        rounded-lg
                        bg-red-50
                        text-red-500
                        border
                        border-red-100
                        flex
                        items-center
                        justify-center
                        hover:bg-red-500
                        hover:text-white
                        transition
                    "
                >

                    <FaTimesCircle
                        size={15}
                    />

                </button>

            </div>

        );

    };


    // =========================
    // APPOINTMENT ROW
    // =========================

    const AppointmentRow = ({
        appointment,
    }) => {

        return (

            <div
                className="
                    grid
                    grid-cols-1
                    md:grid-cols-[110px_1.5fr_1.5fr_140px_100px]
                    gap-4
                    items-center
                    px-5
                    py-4
                    border-t
                    border-gray-100
                    hover:bg-gray-50
                    transition
                "
            >

                {/* DATE / TIME */}

                <div>

                    <p className="
                        text-sm
                        font-semibold
                        text-gray-800
                    ">

                        {formatDate(
                            appointment.appointmentDate
                        )}

                    </p>


                    <div className="
                        flex
                        items-center
                        gap-1.5
                        mt-1
                        text-xs
                        text-gray-500
                    ">

                        <FaClock />

                        {appointment.timeSlot}

                    </div>

                </div>


                {/* PATIENT */}

                <div className="
                    flex
                    items-center
                    gap-3
                ">

                    <div
                        className="
                            w-9
                            h-9
                            rounded-full
                            bg-blue-50
                            text-blue-600
                            flex
                            items-center
                            justify-center
                            text-xs
                            font-bold
                            flex-shrink-0
                        "
                    >

                        {getPatientInitials(
                            appointment.patient
                                ?.fullName
                        )}

                    </div>


                    <div className="
                        min-w-0
                    ">

                        <p className="
                            text-sm
                            font-semibold
                            text-gray-800
                            truncate
                        ">

                            {
                                appointment
                                    .patient
                                    ?.fullName ||
                                "Patient"
                            }

                        </p>


                        <div className="
                            flex
                            items-center
                            gap-1
                            text-xs
                            text-gray-400
                            truncate
                        ">

                            <FaEnvelope />

                            <span className="
                                truncate
                            ">

                                {
                                    appointment
                                        .patient
                                        ?.email ||
                                    "No email"
                                }

                            </span>

                        </div>

                    </div>

                </div>


                {/* REASON */}

                <div className="
                    min-w-0
                ">

                    <p className="
                        text-xs
                        text-gray-400
                        uppercase
                        tracking-wide
                        mb-1
                    ">

                        Reason

                    </p>


                    <p className="
                        text-sm
                        text-gray-700
                        truncate
                    ">

                        {
                            appointment.reason ||
                            "No reason provided"
                        }

                    </p>

                </div>


                {/* STATUS */}

                <div>

                    <StatusBadge
                        status={appointment.status}
                        variant="doctor"
                        className="
                            inline-flex
                            font-semibold
                            items-center
                            gap-1
                            px-2
                            py-1
                            rounded-full
                            border
                            text-xs
                        "
                    />

                </div>


                {/* ACTIONS */}

                <div>

                    {renderActions(
                        appointment
                    )}

                </div>

            </div>

        );

    };


    // =========================
    // APPOINTMENT SECTION
    // =========================

    const AppointmentSection = ({
        title,
        rightLabel,
        appointments,
        emptyTitle,
        emptyMessage,
    }) => {

        return (

            <section className="
                bg-white
                border
                border-gray-200
                rounded-2xl
                shadow-sm
                overflow-hidden
            ">

                {/* SECTION HEADER */}

                <div className="
                    px-5
                    md:px-6
                    py-4
                    border-b
                    border-gray-100
                ">

                    <div className="
                        flex
                        items-center
                        justify-between
                        gap-4
                    ">

                        <div className="
                            flex
                            items-center
                            gap-2
                        ">

                            <FaCalendarAlt
                                className="
                                    text-blue-600
                                "
                            />

                            <h2 className="
                                text-lg
                                font-semibold
                                text-gray-800
                            ">

                                {title}

                            </h2>

                        </div>


                        {/* RIGHT LABEL */}

                        <span className="
                            text-xs
                            sm:text-sm
                            font-medium
                            text-gray-400
                            whitespace-nowrap
                        ">

                            {rightLabel}

                        </span>

                    </div>

                </div>


                {/* EMPTY STATE */}

                {appointments.length === 0 ? (

                    <div className="
                        px-6
                        py-12
                        text-center
                    ">

                        <div className="
                            w-14
                            h-14
                            mx-auto
                            rounded-2xl
                            bg-blue-50
                            flex
                            items-center
                            justify-center
                            mb-4
                        ">

                            <FaCalendarAlt
                                className="
                                    text-blue-300
                                    text-xl
                                "
                            />

                        </div>


                        <h3 className="
                            font-semibold
                            text-gray-700
                        ">

                            {emptyTitle}

                        </h3>


                        <p className="
                            text-sm
                            text-gray-400
                            mt-1
                            max-w-md
                            mx-auto
                        ">

                            {emptyMessage}

                        </p>

                    </div>

                ) : (

                    <>

                        {/* DESKTOP HEADER */}

                        <div
                            className="
                                hidden
                                md:grid
                                md:grid-cols-[110px_1.5fr_1.5fr_140px_100px]
                                gap-4
                                px-5
                                py-3
                                bg-gray-50
                                text-[11px]
                                font-semibold
                                text-gray-400
                                uppercase
                                tracking-wide
                            "
                        >

                            <span>
                                Date & Time
                            </span>

                            <span>
                                Patient
                            </span>

                            <span>
                                Reason
                            </span>

                            <span>
                                Status
                            </span>

                            <span>
                                Actions
                            </span>

                        </div>


                        {appointments.map(
                            (appointment) => (

                                <AppointmentRow
                                    key={
                                        appointment._id
                                    }
                                    appointment={
                                        appointment
                                    }
                                />

                            )
                        )}

                    </>

                )}

            </section>

        );

    };


    // =========================
    // LOADING
    // =========================

    if (loading) {

        return (

            <div className="
                min-h-screen
                bg-[#eef7ff]
                flex
                items-center
                justify-center
            ">

                <div className="
                    text-center
                ">

                    <div className="
                        w-10
                        h-10
                        border-4
                        border-blue-100
                        border-t-blue-600
                        rounded-full
                        animate-spin
                        mx-auto
                        mb-4
                    " />


                    <p className="
                        text-sm
                        text-gray-500
                    ">

                        Loading your appointments...

                    </p>

                </div>

            </div>

        );

    }


    // =========================
    // EMPTY DASHBOARD
    // =========================

    if (appointments.length === 0) {

        return (

            <div className="
                min-h-screen
                bg-[#eef7ff]
            ">

                <div className="
                    max-w-6xl
                    mx-auto
                    px-4
                    py-8
                    md:py-10
                ">

                    {/* HEADER */}

                    <div className="
                        flex
                        flex-col
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                        gap-5
                        mb-8
                    ">

                        <div className="
                            flex
                            items-center
                            gap-4
                        ">

                            <div className="
                                w-12
                                h-12
                                rounded-xl
                                bg-blue-600
                                flex
                                items-center
                                justify-center
                                shadow-sm
                            ">

                                <FaStethoscope
                                    className="
                                        text-white
                                        text-xl
                                    "
                                />

                            </div>


                            <div>

                                <h1 className="
                                    text-2xl
                                    md:text-3xl
                                    font-bold
                                    text-gray-900
                                ">

                                    Doctor Dashboard

                                </h1>


                                <p className="
                                    text-sm
                                    text-gray-500
                                    mt-1
                                ">

                                    Welcome back,{" "}

                                    <span className="
                                        font-medium
                                        text-gray-700
                                    ">

                                        Dr.{" "}
                                        {
                                            user?.fullName ||
                                            "Doctor"
                                        }

                                    </span>

                                </p>

                            </div>

                        </div>


                        <button
                            onClick={() =>
                                navigate(
                                    "/doctor/profile"
                                )
                            }
                            className="
                                self-start
                                sm:self-auto
                                flex
                                items-center
                                justify-center
                                gap-2
                                bg-blue-600
                                hover:bg-blue-700
                                text-white
                                px-5
                                py-2.5
                                rounded-lg
                                text-sm
                                font-semibold
                                transition
                            "
                        >

                            <FaUser />

                            My Profile

                        </button>

                    </div>


                    {/* EMPTY STATE */}

                    <div className="
                        bg-white
                        border
                        border-gray-200
                        rounded-2xl
                        shadow-sm
                        px-6
                        py-16
                        text-center
                    ">

                        <div className="
                            w-20
                            h-20
                            mx-auto
                            rounded-2xl
                            bg-blue-50
                            flex
                            items-center
                            justify-center
                            mb-6
                        ">

                            <FaCalendarAlt
                                className="
                                    text-blue-500
                                    text-3xl
                                "
                            />

                        </div>


                        <h2 className="
                            text-xl
                            md:text-2xl
                            font-bold
                            text-gray-800
                        ">

                            No appointments scheduled

                        </h2>


                        <p className="
                            max-w-md
                            mx-auto
                            text-sm
                            text-gray-500
                            mt-2
                            leading-6
                        ">

                            You don't have any patient
                            appointments yet. Once a
                            patient books a consultation
                            with you, it will appear here.

                        </p>


                        <div className="
                            mt-7
                            flex
                            justify-center
                        ">

                            <button
                                onClick={() =>
                                    navigate(
                                        "/doctor/profile"
                                    )
                                }
                                className="
                                    flex
                                    items-center
                                    gap-2
                                    border
                                    border-gray-200
                                    text-gray-700
                                    hover:bg-gray-50
                                    px-5
                                    py-2.5
                                    rounded-lg
                                    text-sm
                                    font-semibold
                                    transition
                                "
                            >

                                <FaUser />

                                View My Profile

                            </button>

                        </div>

                    </div>

                </div>

            </div>

        );

    }


    // =========================
    // MAIN DASHBOARD
    // =========================

    return (

        <div className="
            min-h-screen
            bg-[#eef7ff]
        ">

            <div className="
                max-w-6xl
                mx-auto
                px-4
                py-8
                md:py-10
            ">


                {/* ================= HEADER ================= */}

                <div className="
                    flex
                    flex-col
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                    gap-5
                    mb-7
                ">

                    <div className="
                        flex
                        items-center
                        gap-4
                    ">

                        <div className="
                            w-12
                            h-12
                            rounded-xl
                            bg-blue-600
                            flex
                            items-center
                            justify-center
                            shadow-sm
                        ">

                            <FaStethoscope
                                className="
                                    text-white
                                    text-xl
                                "
                            />

                        </div>


                        <div>

                            <h1 className="
                                text-2xl
                                md:text-3xl
                                font-bold
                                text-gray-900
                            ">

                                Doctor Dashboard

                            </h1>


                            <p className="
                                text-sm
                                text-gray-500
                                mt-1
                            ">

                                Welcome back,{" "}

                                <span className="
                                    font-medium
                                    text-gray-700
                                ">

                                    {" "}
                                    {
                                        user?.fullName ||
                                        "Doctor"
                                    }

                                </span>

                            </p>

                        </div>

                    </div>


                    <button
                        onClick={() =>
                            navigate(
                                "/doctor/profile"
                            )
                        }
                        className="
                            self-start
                            sm:self-auto
                            flex
                            items-center
                            justify-center
                            gap-2
                            bg-blue-600
                            hover:bg-blue-700
                            text-white
                            px-5
                            py-2.5
                            rounded-lg
                            text-sm
                            font-semibold
                            transition
                            shadow-sm
                        "
                    >

                        <FaUser />

                        My Profile

                    </button>

                </div>


                {/* ================= STATS ================= */}

                <div className="
                    grid
                    grid-cols-2
                    md:grid-cols-5
                    gap-3
                    mb-7
                ">


                    {/* TODAY */}

                    <div className="
                        bg-white
                        border
                        border-gray-200
                        rounded-xl
                        p-4
                        shadow-sm
                    ">

                        <div className="
                            flex
                            items-center
                            gap-3
                        ">

                            <div className="
                                w-10
                                h-10
                                rounded-xl
                                bg-blue-50
                                flex
                                items-center
                                justify-center
                            ">

                                <FaCalendarAlt
                                    className="
                                        text-blue-600
                                    "
                                />

                            </div>


                            <div>

                                <p className="
                                    text-xs
                                    text-gray-400
                                ">

                                    Today

                                </p>


                                <p className="
                                    text-xl
                                    font-bold
                                    text-gray-800
                                ">

                                    {todayAppointments}

                                </p>


                                <p className="
                                    text-[11px]
                                    text-gray-400
                                ">

                                    appointments

                                </p>

                            </div>

                        </div>

                    </div>


                    {/* TOTAL */}

                    <div className="
                        bg-white
                        border
                        border-gray-200
                        rounded-xl
                        p-4
                        shadow-sm
                    ">

                        <p className="
                            text-xs
                            text-gray-400
                        ">

                            Total

                        </p>


                        <p className="
                            text-xl
                            font-bold
                            text-gray-800
                            mt-1
                        ">

                            {totalAppointments}

                        </p>


                        <p className="
                            text-[11px]
                            text-gray-400
                        ">

                            all appointments

                        </p>

                    </div>


                    {/* PENDING */}

                    <div className="
                        bg-white
                        border
                        border-gray-200
                        rounded-xl
                        p-4
                        shadow-sm
                    ">

                        <div className="
                            flex
                            items-center
                            gap-3
                        ">

                            <div className="
                                w-10
                                h-10
                                rounded-xl
                                bg-amber-50
                                flex
                                items-center
                                justify-center
                            ">

                                <FaHourglassHalf
                                    className="
                                        text-amber-500
                                    "
                                />

                            </div>


                            <div>

                                <p className="
                                    text-xs
                                    text-gray-400
                                ">

                                    Pending

                                </p>


                                <p className="
                                    text-xl
                                    font-bold
                                    text-gray-800
                                ">

                                    {
                                        pendingAppointments
                                    }

                                </p>


                                <p className="
                                    text-[11px]
                                    text-gray-400
                                ">

                                    need action

                                </p>

                            </div>

                        </div>

                    </div>


                    {/* CONFIRMED */}

                    <div className="
                        bg-white
                        border
                        border-gray-200
                        rounded-xl
                        p-4
                        shadow-sm
                    ">

                        <div className="
                            flex
                            items-center
                            gap-3
                        ">

                            <div className="
                                w-10
                                h-10
                                rounded-xl
                                bg-blue-50
                                flex
                                items-center
                                justify-center
                            ">

                                <FaClipboardCheck
                                    className="
                                        text-blue-600
                                    "
                                />

                            </div>


                            <div>

                                <p className="
                                    text-xs
                                    text-gray-400
                                ">

                                    Confirmed

                                </p>


                                <p className="
                                    text-xl
                                    font-bold
                                    text-gray-800
                                ">

                                    {
                                        confirmedAppointments
                                    }

                                </p>


                                <p className="
                                    text-[11px]
                                    text-gray-400
                                ">

                                    scheduled

                                </p>

                            </div>

                        </div>

                    </div>


                    {/* COMPLETED */}

                    <div className="
                        bg-white
                        border
                        border-gray-200
                        rounded-xl
                        p-4
                        shadow-sm
                    ">

                        <div className="
                            flex
                            items-center
                            gap-3
                        ">

                            <div className="
                                w-10
                                h-10
                                rounded-xl
                                bg-emerald-50
                                flex
                                items-center
                                justify-center
                            ">

                                <FaCheckCircle
                                    className="
                                        text-emerald-500
                                    "
                                />

                            </div>


                            <div>

                                <p className="
                                    text-xs
                                    text-gray-400
                                ">

                                    Completed

                                </p>


                                <p className="
                                    text-xl
                                    font-bold
                                    text-gray-800
                                ">

                                    {
                                        completedAppointments
                                    }

                                </p>


                                <p className="
                                    text-[11px]
                                    text-gray-400
                                ">

                                    consultations

                                </p>

                            </div>

                        </div>

                    </div>

                </div>


                {/* ================= TODAY ================= */}

                <div className="mb-7">

                    <AppointmentSection
                        title="Today's Appointments"
                        rightLabel={formatTodayDate()}
                        appointments={
                            todaysAppointments
                        }
                        emptyTitle={
                            "No appointments today"
                        }
                        emptyMessage={
                            "You don't have any appointments scheduled for today."
                        }
                    />

                </div>


                {/* ================= UPCOMING ================= */}

                <div className="mb-7">

                    <AppointmentSection
                        title="Upcoming Appointments"
                        rightLabel="Next 7 Days"
                        appointments={
                            upcomingAppointments
                        }
                        emptyTitle={
                            "You're all caught up!"
                        }
                        emptyMessage={
                            "You have no appointments in the next 7 days."
                        }
                    />

                </div>


                {/* ================= ALL APPOINTMENTS ================= */}

                <section className="
                    bg-white
                    border
                    border-gray-200
                    rounded-2xl
                    shadow-sm
                    overflow-hidden
                ">

                    {/* HEADER */}

                    <div className="
                        px-5
                        md:px-6
                        py-4
                        border-b
                        border-gray-100
                    ">

                        <div className="
                            flex
                            flex-col
                            lg:flex-row
                            lg:items-center
                            lg:justify-between
                            gap-4
                        ">

                            <div>

                                <h2 className="
                                    text-lg
                                    font-semibold
                                    text-gray-800
                                ">

                                    All Appointments

                                </h2>


                                <p className="
                                    text-xs
                                    text-gray-400
                                    mt-1
                                ">

                                    View and manage your
                                    complete appointment
                                    history.

                                </p>

                            </div>


                            {/* FILTERS */}

                            <div className="
                                flex
                                flex-wrap
                                gap-1
                                bg-gray-50
                                border
                                border-gray-200
                                rounded-xl
                                p-1
                            ">

                                {[
                                    "All",
                                    "Pending",
                                    "Confirmed",
                                    "Completed",
                                    "Cancelled",
                                ].map(
                                    (status) => (

                                        <button
                                            key={status}
                                            onClick={() =>{
                                                setFilter( status );
                                                setCurrentPage(1);
                                            }}
                                            className={`
                                                px-3
                                                py-1.5
                                                rounded-lg
                                                text-xs
                                                font-semibold
                                                transition
                                                ${
                                                    filter ===
                                                    status
                                                        ? "bg-blue-600 text-white shadow-sm"
                                                        : "text-gray-500 hover:bg-white hover:text-gray-700"
                                                }
                                            `}
                                        >

                                            {status}


                                            <span
                                                className={`
                                                    ml-1
                                                    ${
                                                        filter ===
                                                        status
                                                            ? "text-blue-100"
                                                            : "text-gray-400"
                                                    }
                                                `}
                                            >

                                                {
                                                    status ===
                                                    "All"
                                                        ? appointments.length
                                                        : appointments.filter(
                                                            (
                                                                appointment
                                                            ) =>
                                                                appointment.status ===
                                                                status
                                                        ).length
                                                }

                                            </span>

                                        </button>

                                    )
                                )}

                            </div>

                        </div>

                    </div>


                    {/* FILTERED RESULTS */}

                    {
                        filteredAppointments.length ===  0 ? (

                            <div className="
                                px-6
                                py-12
                                text-center
                            ">

                                <FaCalendarAlt
                                    className="
                                        mx-auto
                                        text-gray-300
                                        text-2xl
                                        mb-3
                                    "
                                />


                                <h3 className="
                                    font-semibold
                                    text-gray-700
                                ">

                                    No{" "}
                                    {
                                        filter.toLowerCase()
                                    }{" "}
                                    appointments

                                </h3>


                                <p className="
                                    text-sm
                                    text-gray-400
                                    mt-1
                                ">

                                    There are no
                                    appointments with
                                    this status.

                                </p>

                            </div>

                        ) : (

                            <>

                                {/* DESKTOP HEADER */}

                                <div
                                    className="
                                        hidden
                                        md:grid
                                        md:grid-cols-[110px_1.5fr_1.5fr_140px_100px]
                                        gap-4
                                        px-5
                                        py-3
                                        bg-gray-50
                                        text-[11px]
                                        font-semibold
                                        text-gray-400
                                        uppercase
                                        tracking-wide
                                    "
                                >

                                    <span>
                                        Date & Time
                                    </span>

                                    <span>
                                        Patient
                                    </span>

                                    <span>
                                        Reason
                                    </span>

                                    <span>
                                        Status
                                    </span>

                                    <span>
                                        Actions
                                    </span>

                                </div>


                                {
                                    paginatedAppointments.map(
                                        ( appointment ) => (

                                            <AppointmentRow
                                                key={ appointment._id  }
                                                appointment={ appointment }
                                            />

                                        )
                                    )
                                }

                                {/* Pagination */}

                                {totalPages > 1 && (

                                    <div className="px-5 py-4 border-t border-gray-100 flex justify-center">

                                        <Pagination
                                            currentPage={currentPage}
                                            totalPages={totalPages}
                                            onPageChange={setCurrentPage}
                                        />

                                    </div>

                                )}

                            </>

                        )

                        
                    }

                </section>

            </div>

        </div>

    );

}


export default DoctorDashboard;