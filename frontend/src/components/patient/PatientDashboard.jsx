import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import RatingModal from "../patient/RatingModal";
import Pagination from "../common/Pagination";

import api from "../../services/api";

import StatusBadge from "../appointment/StatusBadge";

import {
    CalendarDays,
    Clock3,
    Stethoscope,
    CircleCheck,
    CircleX,
    ClockAlert,
    Eye,
    Star,
    UserRound,
    ChevronRight,
    CheckCircle2,
} from "lucide-react";


function PatientDashboard() {

    const navigate = useNavigate();

    const [appointments, setAppointments] = useState([]);

    const [selectedFilter, setSelectedFilter] = useState("All");

    const [myReviews, setMyReviews] = useState([]);

    const [ratingAppointment, setRatingAppointment] = useState(null);

    const [loading, setLoading] = useState(true);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);

    const APPOINTMENTS_PER_PAGE = 10;


    // =========================================================
    // FETCH APPOINTMENTS
    // =========================================================

    const fetchAppointments = async () => {

        try {

            const response = await api.get("/appointments/my");

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


    // =========================================================
    // FETCH REVIEWS
    // =========================================================

    const fetchMyReviews = async () => {

        try {

            const response = await api.get("/reviews/my");

            setMyReviews(
                response.data.reviews || []
            );

        }
        catch (err) {

            console.log(err);

        }

    };


    useEffect(() => {

        fetchAppointments();
        fetchMyReviews();

    }, []);


    // =========================================================
    // DATE HELPERS
    // =========================================================

    const getDateKey = (date) => {

        const d = new Date(date);

        return `${d.getFullYear()}-${String(
            d.getMonth() + 1
        ).padStart(2, "0")}-${String(
            d.getDate()
        ).padStart(2, "0")}`;

    };


    const todayKey = getDateKey(new Date());


    const isToday = (appointment) => {

        return (
            getDateKey(
                appointment.appointmentDate
            ) === todayKey
        );

    };


    const isFuture = (appointment) => {

        const appointmentDate =
            new Date(appointment.appointmentDate);

        const today = new Date();

        today.setHours(0, 0, 0, 0);

        appointmentDate.setHours(0, 0, 0, 0);

        return appointmentDate > today;

    };


    // =========================================================
    // FORMAT DATE
    // =========================================================

    const formatDate = (date) => {

        return new Date(date).toLocaleDateString(
            "en-GB",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );

    };


    const formatShortDate = (date) => {

        return new Date(date).toLocaleDateString(
            "en-GB",
            {
                day: "2-digit",
                month: "short",
            }
        );

    };


    const formatCurrentDate = () => {

        return new Date().toLocaleDateString(
            "en-US",
            {
                weekday: "long",
                day: "2-digit",
                month: "long",
                year: "numeric",
            }
        );

    };

    // =========================================================
    // Status
    // =========================================================
   

    const getStatusDotColor = (status) => {

        switch (status) {

            case "Pending":
                return "bg-amber-500";

            case "Confirmed":
                return "bg-emerald-500";

            case "Completed":
                return "bg-blue-500";

            case "Cancelled":
                return "bg-red-500";

            default:
                return "bg-gray-400";

        }

    };


    // =========================================================
    // REVIEW
    // =========================================================

    const hasReview = (appointmentId) => {

        return myReviews.some(
            (review) =>
                review.appointment === appointmentId ||
                review.appointment?._id === appointmentId
        );

    };


    // =========================================================
    // APPOINTMENT GROUPS
    // =========================================================

    const todaysAppointments = useMemo(() => {

        return appointments
            .filter(isToday)
            .sort(
                (a, b) =>
                    new Date(a.appointmentDate) -
                    new Date(b.appointmentDate)
            );

    }, [appointments]);


    const upcomingAppointments = useMemo(() => {

        return appointments
            .filter(
                (appointment) =>
                    isFuture(appointment) &&
                    (
                        appointment.status === "Pending" ||
                        appointment.status === "Confirmed"
                    )
            )
            .sort(
                (a, b) =>
                    new Date(a.appointmentDate) -
                    new Date(b.appointmentDate)
            );

    }, [appointments]);


    // =========================================================
    // FILTERED APPOINTMENTS
    // =========================================================

    const filteredAppointments = useMemo(() => {

        if (selectedFilter === "All") {

            return appointments;

        }

        return appointments.filter(
            (appointment) =>
                appointment.status === selectedFilter
        );

    }, [appointments, selectedFilter]);


    // =========================================================
    // PAGINATION
    // =========================================================

    const totalPages = Math.ceil(
        filteredAppointments.length /
        APPOINTMENTS_PER_PAGE
    );


    const paginatedAppointments = useMemo(() => {

        const startIndex =
            (currentPage - 1) *
            APPOINTMENTS_PER_PAGE;

        const endIndex =
            startIndex +
            APPOINTMENTS_PER_PAGE;

        return filteredAppointments.slice(
            startIndex,
            endIndex
        );

    }, [
        filteredAppointments,
        currentPage,
    ]);


    // Reset page whenever filter changes

    useEffect(() => {

        setCurrentPage(1);

    }, [selectedFilter]);


    // If current page becomes invalid after deletion/filtering

    useEffect(() => {

        if (
            totalPages > 0 &&
            currentPage > totalPages
        ) {

            setCurrentPage(totalPages);

        }

    }, [
        currentPage,
        totalPages,
    ]);


    // =========================================================
    // STATISTICS
    // =========================================================

    const totalAppointments =
        appointments.length;


    const todayCount =
        todaysAppointments.length;


    const pendingCount =
        appointments.filter(
            (appointment) =>
                appointment.status === "Pending"
        ).length;


    const confirmedCount =
        appointments.filter(
            (appointment) =>
                appointment.status === "Confirmed"
        ).length;


    const completedCount =
        appointments.filter(
            (appointment) =>
                appointment.status === "Completed"
        ).length;


    const cancelledCount =
        appointments.filter(
            (appointment) =>
                appointment.status === "Cancelled"
        ).length;


    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (

            <div className="
                min-h-screen
                flex
                items-center
                justify-center
                bg-gray-50
            ">

                <div className="text-center">

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

                    <p className="text-sm text-gray-500">

                        Loading your appointments...

                    </p>

                </div>

            </div>

        );

    }


    // =========================================================
    // EMPTY DASHBOARD
    // =========================================================

    if (appointments.length === 0) {

        return (

            <div className="
                min-h-screen
                bg-gray-50
                px-4
                py-8
            ">

                <div className="max-w-6xl mx-auto">

                    {/* HEADER */}

                    <div className="
                        flex
                        flex-col
                        md:flex-row
                        md:items-end
                        md:justify-between
                        gap-5
                        mb-8
                    ">

                        <div>

                            <h1 className="
                                text-3xl
                                md:text-4xl
                                font-bold
                                text-gray-900
                            ">

                                My Appointments

                            </h1>

                            <p className="
                                text-gray-500
                                mt-2
                                text-sm
                                md:text-base
                            ">

                                Manage and review your scheduled
                                visits with your care team.

                            </p>

                        </div>


                        <div className="
                            flex
                            flex-col
                            items-start
                            md:items-end
                            gap-3
                        ">

                            <button
                                onClick={() =>
                                    navigate("/patient/profile")
                                }
                                className="
                                    inline-flex
                                    items-center
                                    gap-2
                                    px-4
                                    py-2
                                    rounded-lg
                                    border
                                    border-blue-200
                                    bg-white
                                    text-blue-600
                                    text-sm
                                    font-semibold
                                    hover:bg-blue-50
                                    transition
                                "
                            >

                                <UserRound size={16} />

                                My Profile

                            </button>


                            <div className="
                                flex
                                items-center
                                gap-2
                                text-sm
                                text-gray-500
                            ">

                                <CalendarDays
                                    size={15}
                                    className="text-blue-500"
                                />

                                {formatCurrentDate()}

                            </div>

                        </div>

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

                            <CalendarDays
                                size={34}
                                className="text-blue-500"
                            />

                        </div>


                        <h2 className="
                            text-xl
                            md:text-2xl
                            font-bold
                            text-gray-900
                        ">

                            No appointments yet

                        </h2>


                        <p className="
                            max-w-md
                            mx-auto
                            text-sm
                            text-gray-500
                            mt-2
                            leading-6
                        ">

                            You haven't booked any appointments yet.
                            Find a doctor and schedule your first
                            consultation.

                        </p>


                        <button
                            onClick={() =>
                                navigate("/doctors")
                            }
                            className="
                                mt-6
                                inline-flex
                                items-center
                                gap-2
                                px-5
                                py-2.5
                                rounded-lg
                                bg-blue-600
                                hover:bg-blue-700
                                text-white
                                text-sm
                                font-semibold
                                transition
                            "
                        >

                            <Stethoscope size={17} />

                            Find a Doctor

                        </button>

                    </div>

                </div>

            </div>

        );

    }


    // =========================================================
    // COMPACT APPOINTMENT CARD
    // =========================================================

    const AppointmentCard = ({
        appointment,
        upcoming = false,
    }) => {

        const doctorName =
            appointment.doctor?.user?.fullName ||
            "Doctor";


        const specialization =
            appointment.doctor?.specialization ||
            "Specialist";


        return (

            <div className="
                bg-white
                border
                border-gray-200
                rounded-xl
                shadow-sm
                hover:shadow-md
                transition
                p-4
            ">

                <div className="
                    flex
                    items-center
                    justify-between
                    gap-3
                ">

                    {/* DOCTOR */}

                    <div className="
                        flex
                        items-center
                        gap-3
                        min-w-0
                    ">

                        <div className="
                            w-10
                            h-10
                            rounded-full
                            bg-blue-50
                            text-blue-600
                            flex
                            items-center
                            justify-center
                            flex-shrink-0
                        ">

                            <Stethoscope size={19} />

                        </div>


                        <div className="min-w-0">

                            <h3 className="
                                text-sm
                                font-semibold
                                text-gray-900
                                truncate
                            ">

                                Dr. {doctorName}

                            </h3>


                            <p className="
                                text-xs
                                text-gray-500
                                truncate
                            ">

                                {specialization}

                            </p>

                        </div>

                    </div>


                    {/* STATUS */}

                    <StatusBadge
                        status={appointment.status}
                        variant="patient"
                        className="
                            inline-flex
                            whitespace-nowrap
                            items-center
                            gap-1
                            px-2
                            py-1
                            rounded-full
                            border
                            text-[10px]
                            font-semibold
                        "
                    />

                </div>


                {/* INFO */}

                <div className="
                    flex
                    items-center
                    justify-between
                    gap-3
                    mt-4
                    pt-3
                    border-t
                    border-gray-100
                ">

                    <div className="
                        flex
                        items-center
                        gap-2
                        text-xs
                        text-gray-500
                    ">

                        <CalendarDays
                            size={14}
                            className="text-blue-500"
                        />

                        {upcoming
                            ? formatDate(
                                appointment.appointmentDate
                            )
                            : "Today"
                        }

                    </div>


                    <div className="
                        flex
                        items-center
                        gap-2
                        text-xs
                        text-gray-500
                    ">

                        <Clock3
                            size={14}
                            className="text-blue-500"
                        />

                        {appointment.timeSlot}

                    </div>


                    <button
                        onClick={() =>
                            navigate(
                                `/patient/appointments/${appointment._id}`
                            )
                        }
                        className="
                            inline-flex
                            items-center
                            gap-1
                            text-xs
                            font-semibold
                            text-blue-600
                            hover:text-blue-700
                            transition
                        "
                    >

                        View Details

                        <ChevronRight size={14} />

                    </button>

                </div>

            </div>

        );

    };


    // =========================================================
    // MAIN DASHBOARD
    // =========================================================

    return (

        <div className="
            min-h-screen
             
        ">

            <div className="
                max-w-6xl
                mx-auto
                px-4
                py-8
                md:py-10
            ">


                {/* ================================================= */}
                {/* HEADER */}
                {/* ================================================= */}

                <div className="
                    flex
                    flex-col
                    md:flex-row
                    md:items-end
                    md:justify-between
                    gap-5
                    pb-6
                    border-b
                    border-gray-200
                ">

                    <div>

                        <h1 className="
                            text-3xl
                            md:text-4xl
                            font-bold
                            text-gray-900
                        ">

                            My Appointments

                        </h1>


                        <p className="
                            text-gray-500
                            mt-2
                            text-sm
                            md:text-base
                        ">

                            Manage and review your scheduled
                            visits with your care team.

                        </p>

                    </div>


                    {/* RIGHT SIDE */}

                    <div className="
                        flex
                        flex-col
                        items-start
                        md:items-end
                        gap-2
                    ">

                        {/* PROFILE */}

                        <button
                            onClick={() =>
                                navigate("/patient/profile")
                            }
                            className="
                                inline-flex
                                items-center
                                gap-2
                                px-4
                                py-2
                                rounded-lg
                                border
                                border-blue-200
                                bg-white
                                text-blue-600
                                text-sm
                                font-semibold
                                hover:bg-blue-50
                                transition
                            "
                        >

                            <UserRound size={16} />

                            My Profile

                        </button>


                        {/* DATE */}

                        <div className="
                            flex
                            items-center
                            gap-2
                            text-sm
                            text-gray-500
                        ">

                            <CalendarDays
                                size={15}
                                className="text-blue-500"
                            />

                            {formatCurrentDate()}

                        </div>


                        <p className="
                            text-xs
                            text-gray-400
                        ">

                            Have a great day!

                        </p>

                    </div>

                </div>


                {/* ================================================= */}
                {/* STAT CARDS */}
                {/* ================================================= */}

                <div className="
                    grid
                    grid-cols-2
                    lg:grid-cols-5
                    gap-3
                    mt-6
                ">


                    {/* TOTAL */}

                    <div className="
                        bg-white
                        border
                        border-blue-100
                        rounded-xl
                        p-4
                    ">

                        <div className="flex items-center gap-3">

                            <div className="
                                w-9
                                h-9
                                rounded-full
                                bg-blue-50
                                flex
                                items-center
                                justify-center
                            ">

                                <CalendarDays
                                    size={18}
                                    className="text-blue-600"
                                />

                            </div>


                            <div>

                                <p className="
                                    text-xs
                                    text-gray-500
                                ">

                                    Total Appointments

                                </p>

                                <p className="
                                    text-xl
                                    font-bold
                                    text-blue-600
                                ">

                                    {totalAppointments}

                                </p>

                            </div>

                        </div>

                    </div>


                    {/* TODAY */}

                    <div className="
                        bg-white
                        border
                        border-indigo-100
                        rounded-xl
                        p-4
                    ">

                        <div className="flex items-center gap-3">

                            <div className="
                                w-9
                                h-9
                                rounded-full
                                bg-indigo-50
                                flex
                                items-center
                                justify-center
                            ">

                                <Clock3
                                    size={18}
                                    className="text-indigo-600"
                                />

                            </div>


                            <div>

                                <p className="
                                    text-xs
                                    text-gray-500
                                ">

                                    Today

                                </p>

                                <p className="
                                    text-xl
                                    font-bold
                                    text-indigo-600
                                ">

                                    {todayCount}

                                </p>

                            </div>

                        </div>

                    </div>


                    {/* PENDING */}

                    <div className="
                        bg-white
                        border
                        border-amber-100
                        rounded-xl
                        p-4
                    ">

                        <div className="flex items-center gap-3">

                            <div className="
                                w-9
                                h-9
                                rounded-full
                                bg-amber-50
                                flex
                                items-center
                                justify-center
                            ">

                                <ClockAlert
                                    size={18}
                                    className="text-amber-500"
                                />

                            </div>


                            <div>

                                <p className="
                                    text-xs
                                    text-gray-500
                                ">

                                    Pending

                                </p>

                                <p className="
                                    text-xl
                                    font-bold
                                    text-amber-600
                                ">

                                    {pendingCount}

                                </p>

                            </div>

                        </div>

                    </div>


                    {/* CONFIRMED */}

                    <div className="
                        bg-white
                        border
                        border-emerald-100
                        rounded-xl
                        p-4
                    ">

                        <div className="flex items-center gap-3">

                            <div className="
                                w-9
                                h-9
                                rounded-full
                                bg-emerald-50
                                flex
                                items-center
                                justify-center
                            ">

                                <CircleCheck
                                    size={18}
                                    className="text-emerald-600"
                                />

                            </div>


                            <div>

                                <p className="
                                    text-xs
                                    text-gray-500
                                ">

                                    Confirmed

                                </p>

                                <p className="
                                    text-xl
                                    font-bold
                                    text-emerald-600
                                ">

                                    {confirmedCount}

                                </p>

                            </div>

                        </div>

                    </div>


                    {/* COMPLETED */}

                    <div className="
                        bg-white
                        border
                        border-sky-100
                        rounded-xl
                        p-4
                    ">

                        <div className="flex items-center gap-3">

                            <div className="
                                w-9
                                h-9
                                rounded-full
                                bg-sky-50
                                flex
                                items-center
                                justify-center
                            ">

                                <CheckCircle2
                                    size={18}
                                    className="text-sky-600"
                                />

                            </div>


                            <div>

                                <p className="
                                    text-xs
                                    text-gray-500
                                ">

                                    Completed

                                </p>

                                <p className="
                                    text-xl
                                    font-bold
                                    text-sky-600
                                ">

                                    {completedCount}

                                </p>

                            </div>

                        </div>

                    </div>

                </div>


                {/* ================================================= */}
                {/* FILTERS */}
                {/* ================================================= */}

                <div className="
                    flex
                    flex-wrap
                    gap-2
                    mt-6
                ">

                    {[
                        "All",
                        "Pending",
                        "Confirmed",
                        "Completed",
                        "Cancelled",
                    ].map((filter) => {

                        const count =
                            filter === "All"
                                ? totalAppointments
                                : appointments.filter(
                                    (appointment) =>
                                        appointment.status ===
                                        filter
                                ).length;


                        const isActive =
                            selectedFilter === filter;


                        return (

                            <button
                                key={filter}
                                onClick={() =>
                                    setSelectedFilter(
                                        filter
                                    )
                                }
                                className={`
                                    px-3.5
                                    py-2
                                    rounded-lg
                                    border
                                    text-xs
                                    font-semibold
                                    transition
                                    ${isActive
                                        ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                                        : "bg-white text-gray-600 border-gray-200 hover:border-blue-200 hover:text-blue-600"
                                    }
                                `}
                            >

                                {filter}

                                <span
                                    className={`
                                        ml-1.5
                                        px-1.5
                                        py-0.5
                                        rounded-full
                                        text-[10px]
                                        ${isActive
                                            ? "bg-white/20 text-white"
                                            : "bg-gray-100 text-gray-500"
                                        }
                                    `}
                                >

                                    {count}

                                </span>

                            </button>

                        );

                    })}

                </div>


                {/* ================================================= */}
                {/* TODAY'S APPOINTMENTS */}
                {/* ================================================= */}

                <section className="mt-8">

                    <div className="
                        bg-blue-100
                        overflow-hidden
                        border
                        border-gray-200
                        rounded-2xl
                        shadow-sm
                    ">

                        {/* ================= HEADER ================= */}

                        <div className="
                            flex
                            border-gray-100
                            items-center
                            justify-between
                            px-5
                            md:px-6
                            py-4
                            border-b
                        ">

                            <div className="
                                flex
                                items-center
                                gap-2
                            ">

                                <CalendarDays
                                    size={18}
                                    className="text-blue-600"
                                />

                                <h2 className="
                                    text-lg
                                    font-bold
                                    text-gray-900
                                ">

                                    Today's Appointments

                                </h2>


                                <span className="
                                    px-2
                                    font-semibold
                                    py-0.5
                                    rounded-full
                                    bg-blue-50
                                    text-blue-600
                                    text-xs
                                ">

                                    {todayCount}

                                </span>

                            </div>


                            {todayCount > 0 && (

                                <span className="
                                    text-xs
                                    text-gray-400
                                ">

                                    {formatCurrentDate()}

                                </span>

                            )}

                        </div>


                        {/* ================= CONTENT ================= */}

                        <div className="p-5 md:p-6">

                            {todaysAppointments.length > 0 ? (

                                <div className="
                                    grid
                                    gap-4
                                    grid-cols-1
                                    md:grid-cols-2
                                ">

                                    {todaysAppointments.map(
                                        (appointment) => (

                                            <AppointmentCard
                                                key={  appointment._id }
                                                appointment={ appointment }
                                            />
                                        )
                                    )}

                                </div>

                            ) : (

                                <div className="
                                    px-6
                                    py-7
                                    text-center
                                ">

                                    <div className="
                                        w-12
                                        justify-center
                                        h-12
                                        mx-auto
                                        rounded-xl
                                        bg-gray-50
                                        flex
                                        items-center
                                        mb-3
                                    ">

                                        <CalendarDays
                                            size={21}
                                            className="text-gray-300"
                                        />

                                    </div>


                                    <h3 className="
                                        text-sm
                                        font-semibold
                                        text-gray-700
                                        ">

                                        No appointments today

                                    </h3>


                                    <p className="
                                        text-xs
                                        text-gray-400
                                        mt-1
                                    ">

                                        You don't have any appointments
                                        scheduled for today.

                                    </p>

                                </div>

                            )}

                        </div>

                    </div>

                </section>


                {/* ================================================= */}
                {/* UPCOMING */}
                {/* ================================================= */}


                <section className="mt-8">

                    <div className="
                        bg-slate-50
                        overflow-hidden
                        border
                        border-gray-200
                        rounded-2xl
                        shadow-sm
                    ">

                        {/* ================= HEADER ================= */}

                        <div className="
                            flex
                            border-gray-100
                            items-center
                            justify-between
                            px-5
                            md:px-6
                            py-4
                            border-b
                        ">

                            <div className="
                                flex
                                items-center
                                gap-2
                            ">

                                <CalendarDays
                                    size={18}
                                    className="text-blue-600"
                                />

                                <h2 className="
                                    text-lg
                                    font-bold
                                    text-gray-900
                                ">

                                    Upcoming Appointments

                                </h2>


                                <span className="
                                    px-2
                                    font-semibold
                                    py-0.5
                                    rounded-full
                                    bg-blue-50
                                    text-blue-600
                                    text-xs
                                ">

                                    {upcomingAppointments.length}

                                </span>

                            </div>


                            <span className="
                                text-xs
                                text-gray-400
                            ">

                                Next 7 days

                            </span>

                        </div>


                        {/* ================= CONTENT ================= */}

                        <div className="p-5 md:p-6">

                            {upcomingAppointments.length > 0 ? (

                                <div className="
                                    grid
                                    grid-cols-1
                                    md:grid-cols-2
                                    lg:grid-cols-3
                                    gap-4
                                ">

                                    {upcomingAppointments
                                        .slice(0, 6)
                                        .map(
                                            (appointment) => (

                                                <AppointmentCard
                                                    key={ appointment._id }
                                                    appointment={ appointment }
                                                    upcoming
                                                />
                                            )
                                        )}

                                </div>

                            ) : (

                                <div className="
                                    px-6
                                    py-7
                                    text-center
                                ">

                                    <div className="
                                        w-14
                                        mb-4
                                        h-14
                                        mx-auto
                                        rounded-xl
                                        bg-blue-50
                                        flex
                                        items-center
                                        justify-center
                                    ">

                                        <CheckCircle2
                                            size={25}
                                            className="text-blue-500"
                                        />

                                    </div>


                                    <h3 className="
                                        text-base
                                        font-semibold
                                        text-gray-800
                                    ">

                                        You're all caught up!

                                    </h3>


                                    <p className="
                                        text-sm
                                        text-gray-400
                                        mt-1
                                    ">

                                        You don't have any upcoming
                                        appointments in the next 7 days.

                                    </p>


                                    <button
                                        onClick={() =>
                                            navigate("/doctors")
                                        }
                                        className="
                                            mt-4
                                            hover:text-blue-700
                                            inline-flex
                                            items-center
                                            gap-2
                                            text-sm
                                            font-semibold
                                            text-blue-600
                                        "
                                    >

                                        Find a Doctor

                                        <ChevronRight size={15} />

                                    </button>

                                </div>

                            )}

                        </div>

                    </div>

                </section>


                {/* ================================================= */}
                {/* ALL APPOINTMENTS */}
                {/* ================================================= */}

                <section className="
                    mt-8
                    bg-white
                    border
                    border-gray-200
                    rounded-2xl
                    shadow-sm
                    overflow-hidden
                ">

                    {/* TABLE HEADER */}

                    <div className="
                        px-5
                        md:px-6
                        py-5
                        border-b
                        border-gray-100
                    ">

                        <div className="
                            flex
                            flex-col
                            md:flex-row
                            md:items-center
                            md:justify-between
                            gap-3
                        ">

                            <div>

                                <h2 className="
                                    text-lg
                                    font-bold
                                    text-gray-900
                                ">

                                    All Appointments

                                </h2>


                                <p className="
                                    text-xs
                                    text-gray-400
                                    mt-1
                                ">

                                    View your complete appointment
                                    history.

                                </p>

                            </div>


                            <div className="
                                text-xs
                                text-gray-400
                            ">

                                Showing{" "}

                                <span className="
                                    font-semibold
                                    text-gray-700
                                ">

                                    {filteredAppointments.length === 0
                                        ? 0
                                        : (currentPage - 1) *
                                        APPOINTMENTS_PER_PAGE +
                                        1
                                    }

                                </span>

                                {" "}–{" "}

                                <span className="
                                    font-semibold
                                    text-gray-700
                                ">

                                    {Math.min(
                                        currentPage *
                                        APPOINTMENTS_PER_PAGE,
                                        filteredAppointments.length
                                    )}

                                </span>

                                {" "}of{" "}

                                <span className="
                                    font-semibold
                                    text-gray-700
                                ">

                                    {filteredAppointments.length}

                                </span>

                            </div>

                        </div>

                    </div>


                    {paginatedAppointments.length === 0 ? (

                        <div className="
                            px-6
                            py-12
                            text-center
                        ">

                            <CalendarDays
                                size={28}
                                className="
                                    mx-auto
                                    text-gray-300
                                    mb-3
                                "
                            />


                            <h3 className="
                                font-semibold
                                text-gray-700
                            ">

                                No {selectedFilter.toLowerCase()}
                                appointments

                            </h3>


                            <p className="
                                text-sm
                                text-gray-400
                                mt-1
                            ">

                                There are no appointments
                                with this status.

                            </p>

                        </div>

                    ) : (

                        <>

                            {/* DESKTOP TABLE */}

                            <div className="
                                hidden
                                md:block
                                overflow-x-auto
                            ">

                                <table className="
                                    w-full
                                    text-sm
                                ">

                                    <thead>

                                        <tr className="
                                            bg-gray-50
                                            border-b
                                            border-gray-100
                                            text-[11px]
                                            uppercase
                                            tracking-wide
                                            text-gray-400
                                        ">

                                            <th className="
                                                text-left
                                                font-semibold
                                                px-5
                                                py-3
                                            ">

                                                Doctor

                                            </th>


                                            <th className="
                                                text-left
                                                font-semibold
                                                px-4
                                                py-3
                                            ">

                                                Date & Time

                                            </th>


                                            <th className="
                                                text-left
                                                font-semibold
                                                px-4
                                                py-3
                                            ">

                                                Reason

                                            </th>


                                            <th className="
                                                text-left
                                                font-semibold
                                                px-4
                                                py-3
                                            ">

                                                Fee

                                            </th>


                                            <th className="
                                                text-left
                                                font-semibold
                                                px-4
                                                py-3
                                            ">

                                                Status

                                            </th>


                                            <th className="
                                                text-right
                                                font-semibold
                                                px-5
                                                py-3
                                            ">

                                                Action

                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {paginatedAppointments.map(
                                            (appointment) => (

                                                <tr
                                                    key={
                                                        appointment._id
                                                    }
                                                    className="
                                                        border-b
                                                        border-gray-100
                                                        last:border-0
                                                        hover:bg-gray-50
                                                        transition
                                                    "
                                                >

                                                    {/* DOCTOR */}

                                                    <td className="
                                                        px-5
                                                        py-4
                                                    ">

                                                        <div className="
                                                            flex
                                                            items-center
                                                            gap-3
                                                        ">

                                                            <div className="
                                                                w-9
                                                                h-9
                                                                rounded-full
                                                                bg-blue-50
                                                                text-blue-600
                                                                flex
                                                                items-center
                                                                justify-center
                                                                flex-shrink-0
                                                            ">

                                                                <Stethoscope
                                                                    size={17}
                                                                />

                                                            </div>


                                                            <div>

                                                                <p className="
                                                                    font-semibold
                                                                    text-gray-800
                                                                ">

                                                                    Dr.{" "}
                                                                    {appointment.doctor?.user?.fullName ||
                                                                        "Doctor"}

                                                                </p>


                                                                <p className="
                                                                    text-xs
                                                                    text-gray-400
                                                                    mt-0.5
                                                                ">

                                                                    {appointment.doctor?.specialization ||
                                                                        "Specialist"}

                                                                </p>

                                                            </div>

                                                        </div>

                                                    </td>


                                                    {/* DATE */}

                                                    <td className="
                                                        px-4
                                                        py-4
                                                    ">

                                                        <p className="
                                                            text-sm
                                                            font-medium
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
                                                            text-xs
                                                            text-gray-400
                                                            mt-1
                                                        ">

                                                            <Clock3
                                                                size={13}
                                                            />

                                                            {
                                                                appointment.timeSlot
                                                            }

                                                        </div>

                                                    </td>


                                                    {/* REASON */}

                                                    <td className="
                                                        px-4
                                                        py-4
                                                        max-w-[220px]
                                                    ">

                                                        <p className="
                                                            text-sm
                                                            text-gray-600
                                                            truncate
                                                        ">

                                                            {appointment.reason ||
                                                                "No reason provided"}

                                                        </p>

                                                    </td>


                                                    {/* FEE */}

                                                    <td className="
                                                        px-4
                                                        py-4
                                                    ">

                                                        <span className="
                                                            font-semibold
                                                            text-gray-800
                                                        ">

                                                            ₹
                                                            {appointment.doctor?.consultationFee ||
                                                                0}

                                                        </span>

                                                    </td>


                                                    {/* STATUS */}

                                                    <td className="
                                                        px-4
                                                        py-4
                                                    ">

                                                        <StatusBadge
                                                            status={appointment.status}
                                                            variant="patient"
                                                            className="
                                                                inline-flex
                                                                font-semibold
                                                                items-center
                                                                gap-1.5
                                                                px-2.5
                                                                py-1.5
                                                                rounded-full
                                                                border
                                                                text-xs
                                                        "
                                                        />

                                                    </td>


                                                    {/* ACTION */}

                                                    <td className="
                                                        px-5
                                                        py-4
                                                        text-right
                                                    ">

                                                        <button
                                                            onClick={() =>
                                                                navigate(
                                                                    `/patient/appointments/${appointment._id}`
                                                                )
                                                            }
                                                            className="
                                                                inline-flex
                                                                items-center
                                                                gap-1.5
                                                                px-3
                                                                py-1.5
                                                                rounded-lg
                                                                border
                                                                border-blue-200
                                                                bg-blue-50
                                                                text-blue-600
                                                                text-xs
                                                                font-semibold
                                                                hover:bg-blue-100
                                                                transition
                                                            "
                                                        >

                                                            <Eye
                                                                size={14}
                                                            />

                                                            View Details

                                                        </button>

                                                    </td>

                                                </tr>

                                            )
                                        )}

                                    </tbody>

                                </table>

                            </div>


                            {/* MOBILE TABLE-LIKE CARDS */}

                            <div className="
                                md:hidden
                                divide-y
                                divide-gray-100
                            ">

                                {paginatedAppointments.map(
                                    (appointment) => (

                                        <div
                                            key={
                                                appointment._id
                                            }
                                            className="
                                                p-4
                                            "
                                        >

                                            <div className="
                                                flex
                                                items-center
                                                justify-between
                                                gap-3
                                            ">

                                                <div className="
                                                    flex
                                                    items-center
                                                    gap-3
                                                ">

                                                    <div className="
                                                        w-9
                                                        h-9
                                                        rounded-full
                                                        bg-blue-50
                                                        text-blue-600
                                                        flex
                                                        items-center
                                                        justify-center
                                                    ">

                                                        <Stethoscope
                                                            size={16}
                                                        />

                                                    </div>


                                                    <div>

                                                        <p className="
                                                            text-sm
                                                            font-semibold
                                                            text-gray-800
                                                        ">

                                                            Dr.{" "}
                                                            {appointment.doctor?.user?.fullName ||
                                                                "Doctor"}

                                                        </p>


                                                        <p className="
                                                            text-xs
                                                            text-gray-400
                                                        ">

                                                            {appointment.doctor?.specialization ||
                                                                "Specialist"}

                                                        </p>

                                                    </div>

                                                </div>


                                                <StatusBadge
                                                    status={appointment.status}
                                                    variant="patient"
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


                                            <div className="
                                                grid
                                                grid-cols-2
                                                gap-3
                                                mt-4
                                            ">

                                                <div className="
                                                    bg-gray-50
                                                    rounded-lg
                                                    p-3
                                                ">

                                                    <p className="
                                                        text-[10px]
                                                        uppercase
                                                        tracking-wide
                                                        text-gray-400
                                                    ">

                                                        Date

                                                    </p>


                                                    <p className="
                                                        text-xs
                                                        font-semibold
                                                        text-gray-700
                                                        mt-1
                                                    ">

                                                        {formatShortDate(
                                                            appointment.appointmentDate
                                                        )}

                                                    </p>

                                                </div>


                                                <div className="
                                                    bg-gray-50
                                                    rounded-lg
                                                    p-3
                                                ">

                                                    <p className="
                                                        text-[10px]
                                                        uppercase
                                                        tracking-wide
                                                        text-gray-400
                                                    ">

                                                        Time

                                                    </p>


                                                    <p className="
                                                        text-xs
                                                        font-semibold
                                                        text-gray-700
                                                        mt-1
                                                    ">

                                                        {
                                                            appointment.timeSlot
                                                        }

                                                    </p>

                                                </div>

                                            </div>


                                            <button
                                                onClick={() =>
                                                    navigate(
                                                        `/patient/appointments/${appointment._id}`
                                                    )
                                                }
                                                className="
                                                    w-full
                                                    mt-3
                                                    inline-flex
                                                    items-center
                                                    justify-center
                                                    gap-2
                                                    px-3
                                                    py-2
                                                    rounded-lg
                                                    bg-blue-50
                                                    text-blue-600
                                                    text-xs
                                                    font-semibold
                                                "
                                            >

                                                <Eye size={14} />

                                                View Details

                                            </button>

                                        </div>

                                    )
                                )}

                            </div>


                            {/* PAGINATION */}

                            {totalPages > 1 && (

                                <div className="
                                    px-5
                                    py-4
                                    border-t
                                    border-gray-100
                                    flex
                                    justify-center
                                ">

                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        onPageChange={
                                            setCurrentPage
                                        }
                                    />

                                </div>

                            )}

                        </>

                    )}

                </section>

            </div>


            {/* ================================================= */}
            {/* RATING MODAL */}
            {/* ================================================= */}

            {ratingAppointment && (

                <RatingModal
                    appointment={ratingAppointment}

                    onClose={() =>
                        setRatingAppointment(null)
                    }

                    onSuccess={(review) => {

                        setMyReviews((prev) => [
                            ...prev,
                            review,
                        ]);

                    }}
                />

            )}

        </div>

    );

}


export default PatientDashboard;