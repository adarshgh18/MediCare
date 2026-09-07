import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    FaArrowLeft,
    FaUserMd,
    FaHospital,
    FaGraduationCap,
    FaClock,
    FaRupeeSign,
    FaCalendarAlt,
    FaEnvelope,
    FaUser,
    FaEdit,
    FaTrash,
    FaUsers,
    FaStar,
    FaChevronLeft,
    FaChevronRight,
} from "react-icons/fa";

import api from "../../services/api";

import InfoCard from "../doctor/InfoCard";
import ServerError from "../common/ServerError";

import { formatShortDate } from "../../utils/dateUtils";

import toast from "react-hot-toast";

function AdminDoctorDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [doctor, setDoctor] = useState(null);

    const [removing, setRemoving] = useState(false);

    const [stats, setStats] = useState({
        totalAppointments: 0,
        completedAppointments: 0,
        patientsTreated: 0,
        averageRating: 0,
        totalReviews: 0,
    });

    const [reviews, setReviews] = useState([]);

    const [loading, setLoading] = useState(true);
    const [serverError, setServerError] = useState(false);
    const [notFound, setNotFound] = useState(false);

    // Reviews pagination
    const [currentPage, setCurrentPage] = useState(1);

    const reviewsPerPage = 4;

    const fetchDoctor = async () => {
        try {
            setLoading(true);
            setServerError(false);
            setNotFound(false);

            const response = await api.get(
                `/admin/doctors/${id}`
            );

            setDoctor(response.data.doctor);

            setStats(
                response.data.stats || {
                    totalAppointments: 0,
                    completedAppointments: 0,
                    patientsTreated: 0,
                    averageRating: 0,
                    totalReviews: 0,
                }
            );

            setReviews(
                response.data.reviews || []
            );

            setCurrentPage(1);
        } catch (err) {
            console.error(
                "Failed to fetch admin doctor:",
                err
            );

            if (err.response?.status === 404) {
                setNotFound(true);
            } else {
                setServerError(true);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveDoctor = async () => {
        const confirmed = window.confirm(
            "Are you sure you want to remove this doctor? This will permanently delete the doctor account and profile."
        );

        if (!confirmed) {
            return;
        }

        try {
            setRemoving(true);

            const response = await api.delete(
                `/admin/doctors/${id}`
            );

            toast.success(
                response.data.message ||
                "Doctor removed successfully."
            );

            navigate("/admin/doctors");

        } catch (err) {
            console.error(
                "Remove doctor error:",
                err
            );

            toast.error(
                err.response?.data?.message ||
                "Failed to remove doctor."
            );

        } finally {
            setRemoving(false);
        }
    };

    useEffect(() => {
        fetchDoctor();
    }, [id]);

    const getInitials = (name = "") => {
        return name
            .split(" ")
            .filter(Boolean)
            .map((word) => word[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();
    };

    // -------------------------
    // Reviews pagination
    // -------------------------

    const totalPages = Math.ceil(
        reviews.length / reviewsPerPage
    );

    const startIndex =
        (currentPage - 1) * reviewsPerPage;

    const currentReviews = reviews.slice(
        startIndex,
        startIndex + reviewsPerPage
    );

    const goToPreviousPage = () => {
        setCurrentPage((prev) =>
            Math.max(prev - 1, 1)
        );
    };

    const goToNextPage = () => {
        setCurrentPage((prev) =>
            Math.min(prev + 1, totalPages)
        );
    };

    if (loading) {
        return (
            <div className="
                flex
                items-center
                justify-center
                min-h-[400px]
            ">
                <p className="text-gray-500">
                    Loading doctor details...
                </p>
            </div>
        );
    }

    if (serverError) {
        return (
            <ServerError
                onRetry={fetchDoctor}
            />
        );
    }

    if (notFound || !doctor) {
        return (
            <div className="
                min-h-screen
                flex
                items-center
                justify-center
                px-4
            ">
                <div className="
                    w-full
                    max-w-md
                    bg-white
                    border
                    border-gray-200
                    rounded-3xl
                    shadow-sm
                    p-8
                    text-center
                ">
                    <div className="
                        w-16
                        h-16
                        mx-auto
                        rounded-2xl
                        bg-red-50
                        flex
                        items-center
                        justify-center
                        text-red-500
                        mb-5
                    ">
                        <FaUserMd size={28} />
                    </div>

                    <h1 className="
                        text-xl
                        font-bold
                        text-gray-900
                    ">
                        Doctor not found
                    </h1>

                    <p className="
                        text-sm
                        text-gray-500
                        mt-2
                        leading-6
                    ">
                        The doctor profile you're looking
                        for doesn't exist or may have been
                        removed.
                    </p>

                    <button
                        onClick={() =>
                            navigate("/admin/doctors")
                        }
                        className="
                            mt-6
                            bg-blue-600
                            hover:bg-blue-700
                            text-white
                            px-5
                            py-2.5
                            rounded-xl
                            font-semibold
                            text-sm
                            transition
                        "
                    >
                        Back to Doctors
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="
            max-w-6xl
            mx-auto
            pb-10
        ">

            {/* Back */}
            <button
                onClick={() =>
                    navigate("/admin/doctors")
                }
                className="
                    flex
                    items-center
                    gap-2
                    text-blue-600
                    hover:text-blue-800
                    font-medium
                    mb-6
                "
            >
                <FaArrowLeft />
                Back to Doctors
            </button>

            {/* =========================
                DOCTOR HEADER
            ========================= */}

            <div className="
                bg-white
                border
                border-gray-200
                rounded-3xl
                p-6
                md:p-8
                shadow-sm
            ">
                <div className="
                    flex
                    flex-col
                    lg:flex-row
                    lg:items-center
                    gap-6
                ">

                    {/* Avatar */}

                    <div className="
                        w-28
                        h-28
                        md:w-32
                        md:h-32
                        rounded-2xl
                        bg-blue-50
                        border
                        border-blue-100
                        overflow-hidden
                        flex
                        items-center
                        justify-center
                        shrink-0
                    ">
                        {doctor.image ? (
                            <img
                                src={doctor.image}
                                alt={
                                    doctor.user?.fullName ||
                                    "Doctor"
                                }
                                className="
                                    w-full
                                    h-full
                                    object-cover
                                "
                            />
                        ) : (
                            <span className="
                                text-3xl
                                font-bold
                                text-blue-600
                            ">
                                {getInitials(
                                    doctor.user?.fullName
                                )}
                            </span>
                        )}
                    </div>

                    {/* Doctor information */}

                    <div className="
                        flex-1
                        text-center
                        lg:text-left
                    ">
                        <p className="
                            text-xs
                            font-semibold
                            text-blue-600
                            uppercase
                            tracking-wider
                        ">
                            Doctor Profile
                        </p>

                        <h1 className="
                            text-2xl
                            md:text-3xl
                            font-bold
                            text-gray-900
                            mt-1
                        ">
                            {doctor.user?.fullName ||
                                "Unknown Doctor"}
                        </h1>

                        <p className="
                            text-base
                            md:text-lg
                            text-gray-500
                            mt-1
                        ">
                            {doctor.specialization ||
                                "No specialization"}
                        </p>

                        <div className="
                            flex
                            flex-wrap
                            justify-center
                            lg:justify-start
                            items-center
                            gap-x-4
                            gap-y-2
                            mt-3
                            text-sm
                            text-gray-500
                        ">
                            <span className="
                                flex
                                items-center
                                gap-1.5
                            ">
                                <FaHospital
                                    className="text-blue-500"
                                />

                                {doctor.hospital ||
                                    "Hospital not provided"}
                            </span>

                            <span className="
                                flex
                                items-center
                                gap-1.5
                            ">
                                <FaGraduationCap
                                    className="text-blue-500"
                                />

                                {doctor.qualification ||
                                    "Qualification not provided"}
                            </span>
                        </div>
                    </div>

                    {/* Actions */}

                    <button
                        onClick={handleRemoveDoctor}
                        disabled={removing}
                        className="
                            flex
                            items-center
                            disabled:cursor-not-allowed
                            gap-2
                            px-4
                            py-2.5
                            rounded-xl
                            border
                            border-red-200
                            bg-red-50
                            text-red-600
                            hover:bg-red-100
                            hover:border-red-300
                            font-semibold
                            text-sm
                            transition-all
                            duration-200
                            disabled:opacity-50
                        "
                    >
                        <FaTrash size={13} />

                        {removing ? "Removing..." : "Remove"}
                    </button>
                </div>
            </div>

            {/* =========================
                STATS
            ========================= */}

            <div className="
                grid
                grid-cols-2
                xl:grid-cols-4
                gap-4
                mt-6
            ">
                <InfoCard
                    icon={<FaClock />}
                    title="Experience"
                    value={`${doctor.experience ?? 0} Years`}
                />

                <InfoCard
                    icon={<FaUsers />}
                    title="Patients Treated"
                    value={stats.patientsTreated}
                />

                <InfoCard
                    icon={<FaCalendarAlt />}
                    title="Appointments"
                    value={stats.totalAppointments}
                />

                <InfoCard
                    icon={<FaRupeeSign />}
                    title="Consultation Fee"
                    value={`₹${doctor.consultationFee ?? 0}`}
                />
            </div>

            {/* =========================
            ABOUT + ACCOUNT + AVAILABILITY
            ========================= */}

            <div
                className="
                items-start
                grid
                lg:grid-cols-[1.1fr_0.9fr]
                gap-6
                mt-6
            "
            >
                {/* =========================
                LEFT COLUMN
                ========================= */}

                <div
                    className="
                        flex
                        gap-6
                        flex-col
                    "
                >

                    {/* ABOUT DOCTOR */}

                    <div
                        className="
                            bg-white
                            shadow-sm
                            border
                            border-gray-200
                            rounded-3xl
                            p-6
                            md:p-8
                        "
                    >
                        <h2
                            className="
                                text-xl
                                mb-4
                                font-bold
                                text-gray-900
                            "
                        >
                            About Doctor
                        </h2>

                        <p
                            className="
                                text-gray-600
                                leading-7
                            "
                        >
                            {doctor.bio ||
                                "No biography has been provided for this doctor."}
                        </p>
                    </div>


                    {/* ACCOUNT INFORMATION */}

                    <div
                        className="
                            bg-white
                            shadow-sm
                            border
                            border-gray-200
                            rounded-3xl
                            p-6
                            md:p-8
                        "
                    >
                        <h2
                            className="
                                text-xl
                                mb-5
                                font-bold
                                text-gray-900
                            "
                        >
                            Account Information
                        </h2>

                        <div
                            className="
                                grid
                                gap-5
                                grid-cols-1
                                sm:grid-cols-3
                            "
                        >

                            {/* Username */}

                            <div
                                className="
                                    flex
                                    min-w-0
                                    items-center
                                    gap-3
                                "
                            >
                                <div
                                    className="
                                        w-10
                                        shrink-0
                                        h-10
                                        rounded-xl
                                        bg-blue-50
                                        text-blue-600
                                        flex
                                        items-center
                                        justify-center
                                    "
                                >
                                    <FaUser />
                                </div>

                                <div className="min-w-0">
                                    <p
                                        className="
                                            text-xs
                                            text-gray-400
                                        "
                                    >
                                        Username
                                    </p>

                                    <p
                                        className="
                                            font-medium
                                            text-gray-800
                                            truncate
                                        "
                                    >
                                        {doctor.user?.username ||
                                            "Not available"}
                                    </p>
                                </div>
                            </div>


                            {/* Email */}

                            <div
                                className="
                                    flex
                                    min-w-0
                                    items-center
                                    gap-3
                                "
                            >
                                <div
                                    className="
                                        w-10
                                        shrink-0
                                        h-10
                                        rounded-xl
                                        bg-blue-50
                                        text-blue-600
                                        flex
                                        items-center
                                        justify-center
                                    "
                                >
                                    <FaEnvelope />
                                </div>

                                <div className="min-w-0">
                                    <p
                                        className="
                                            text-xs
                                            text-gray-400
                                        "
                                    >
                                        Email
                                    </p>

                                    <p
                                        className="
                                            font-medium
                                            truncate
                                            text-gray-800
                                        "
                                    >
                                        {doctor.user?.email ||
                                            "Not available"}
                                    </p>
                                </div>
                            </div>


                            {/* Registered */}

                            <div
                                className="
                                    flex
                                    gap-3
                                    items-center
                                    min-w-0
                                "
                            >
                                <div
                                    className="
                                        w-10
                                        shrink-0
                                        h-10
                                        rounded-xl
                                        bg-blue-50
                                        text-blue-600
                                        flex
                                        items-center
                                        justify-center
                                    "
                                >
                                    <FaCalendarAlt />
                                </div>

                                <div className="min-w-0">
                                    <p
                                        className="
                                            text-xs
                                            text-gray-400
                                        "
                                    >
                                        Registered
                                    </p>

                                    <p
                                        className="
                                            font-medium
                                            text-gray-800
                                            whitespace-nowrap
                                        "
                                    >
                                        {doctor.user?.createdAt
                                            ? formatShortDate(doctor.user.createdAt)
                                            : "Not available"}
                                    </p>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>


                {/* =========================
                AVAILABILITY
                ========================= */}

                <div
                    className="
                        bg-white
                        overflow-hidden
                        border
                        border-gray-200
                        rounded-3xl
                        p-6
                        md:p-8
                        shadow-sm
            
                        flex
                        flex-col
            
                        lg:h-[317px]
                    "
                >

                    {/* Availability Header */}

                    <div
                        className="
                            flex
                items-center
                justify-between
                gap-3
                mb-5
                shrink-0
            "
                    >

                        <div
                            className="
                    flex
                    items-center
                    gap-3
                "
                        >
                            <FaCalendarAlt
                                className="text-blue-600"
                            />

                            <h2
                                className="
                        text-xl
                        font-bold
                        text-gray-900
                    "
                            >
                                Availability
                            </h2>
                        </div>

                        {doctor.availability?.length > 0 && (
                            <span
                                className="
                        text-xs
                        font-medium
                        text-gray-400
                    "
                            >
                                {doctor.availability.length}{" "}
                                {doctor.availability.length === 1
                                    ? "day"
                                    : "days"}
                            </span>
                        )}

                    </div>


                    {/* SCROLLABLE AVAILABILITY */}

                    {doctor.availability?.length > 0 ? (

                        <div
                            className="
                    flex-1
                    overflow-y-auto
                    pr-2
                    space-y-3
                    min-h-0
                "
                        >

                            {doctor.availability.map(
                                (day) => (

                                    <div
                                        key={
                                            day._id ||
                                            day.day
                                        }
                                        className="
                                border
                                border-gray-200
                                rounded-2xl
                                p-4
                            "
                                    >

                                        <h3
                                            className="
                                    font-semibold
                                    text-gray-800
                                    mb-3
                                "
                                        >
                                            {day.day}
                                        </h3>

                                        <div
                                            className="
                                    flex
                                    flex-wrap
                                    gap-2
                                "
                                        >
                                            {day.slots?.map(
                                                (slot) => (

                                                    <span
                                                        key={slot}
                                                        className="
                                                px-3
                                                py-1.5
                                                rounded-full
                                                bg-blue-50
                                                text-blue-700
                                                text-sm
                                                font-medium
                                            "
                                                    >
                                                        {slot}
                                                    </span>

                                                )
                                            )}
                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    ) : (

                        <div
                            className="
                    flex-1
                    flex
                    items-center
                    justify-center
                "
                        >
                            <p
                                className="
                        text-sm
                        text-gray-500
                    "
                            >
                                No availability has been added yet.
                            </p>
                        </div>

                    )}

                </div>

            </div>

            {/* =========================
                RATINGS & REVIEWS
            ========================= */}

            <div className="
                bg-white
                border
                border-gray-200
                rounded-3xl
                p-6
                md:p-8
                shadow-sm
                mt-6
            ">

                {/* Review Header */}

                <div className="
                    flex
                    items-center
                    justify-between
                    gap-4
                    mb-6
                ">
                    <div>
                        <h2 className="
                            text-xl
                            font-bold
                            text-gray-900
                        ">
                            Ratings & Reviews
                        </h2>

                        <p className="
                            text-sm
                            text-gray-500
                            mt-1
                        ">
                            Patient feedback for this doctor
                        </p>
                    </div>

                    <div className="
                        text-right
                        shrink-0
                    ">
                        <div className="
                            flex
                            items-center
                            justify-end
                            gap-1.5
                        ">
                            <FaStar
                                className="text-yellow-400"
                            />

                            <span className="
                                text-2xl
                                font-bold
                                text-gray-900
                            ">
                                {stats.averageRating
                                    ? stats.averageRating.toFixed(1)
                                    : "0.0"}
                            </span>
                        </div>

                        <p className="
                            text-xs
                            text-gray-500
                            mt-1
                        ">
                            {stats.totalReviews}{" "}
                            {stats.totalReviews === 1
                                ? "review"
                                : "reviews"}
                        </p>
                    </div>
                </div>

                {reviews.length > 0 ? (
                    <>
                        {/* Reviews - 2 per row */}

                        <div className="
                            grid
                            md:grid-cols-2
                            gap-4
                        ">
                            {currentReviews.map(
                                (review) => (
                                    <div
                                        key={review._id}
                                        className="
                                            border
                                            border-gray-100
                                            rounded-2xl
                                            p-4
                                            bg-gray-50/50
                                        "
                                    >
                                        <div className="
                                            flex
                                            items-center
                                            justify-between
                                            gap-3
                                        ">

                                            <div className="
                                                min-w-0
                                            ">
                                                <p className="
                                                    font-semibold
                                                    text-gray-800
                                                    truncate
                                                ">
                                                    {review.patient?.fullName ||
                                                        "Patient"}
                                                </p>

                                                <p className="
                                                    text-xs
                                                    text-gray-400
                                                    mt-0.5
                                                ">
                                                    {review.createdAt
                                                        ? formatShortDate(review.createdAt)
                                                        : ""}
                                                </p>
                                            </div>

                                            <span className="
                                                flex
                                                items-center
                                                gap-1
                                                text-sm
                                                font-semibold
                                                text-yellow-600
                                                shrink-0
                                            ">
                                                <FaStar />
                                                {review.rating}/5
                                            </span>

                                        </div>

                                        {review.comment && (
                                            <p className="
                                                text-sm
                                                text-gray-600
                                                mt-3
                                                leading-6
                                                line-clamp-3
                                            ">
                                                {review.comment}
                                            </p>
                                        )}
                                    </div>
                                )
                            )}
                        </div>

                        {/* Pagination */}

                        {totalPages > 1 && (
                            <div className="
                                flex
                                items-center
                                justify-between
                                mt-6
                                pt-5
                                border-t
                                border-gray-100
                            ">

                                <button
                                    onClick={
                                        goToPreviousPage
                                    }
                                    disabled={
                                        currentPage === 1
                                    }
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                        px-3.5
                                        py-2
                                        rounded-xl
                                        border
                                        border-gray-200
                                        text-sm
                                        font-medium
                                        text-gray-600
                                        hover:bg-gray-50
                                        disabled:opacity-40
                                        disabled:cursor-not-allowed
                                        transition
                                    "
                                >
                                    <FaChevronLeft />
                                    Previous
                                </button>

                                <div className="
                                    flex
                                    items-center
                                    gap-2
                                ">
                                    <span className="
                                        text-sm
                                        font-semibold
                                        text-gray-800
                                    ">
                                        {currentPage}
                                    </span>

                                    <span className="
                                        text-sm
                                        text-gray-400
                                    ">
                                        /
                                    </span>

                                    <span className="
                                        text-sm
                                        text-gray-500
                                    ">
                                        {totalPages}
                                    </span>
                                </div>

                                <button
                                    onClick={
                                        goToNextPage
                                    }
                                    disabled={
                                        currentPage ===
                                        totalPages
                                    }
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                        px-3.5
                                        py-2
                                        rounded-xl
                                        border
                                        border-gray-200
                                        text-sm
                                        font-medium
                                        text-gray-600
                                        hover:bg-gray-50
                                        disabled:opacity-40
                                        disabled:cursor-not-allowed
                                        transition
                                    "
                                >
                                    Next
                                    <FaChevronRight />
                                </button>

                            </div>
                        )}
                    </>
                ) : (
                    <div className="
                        bg-gray-50
                        rounded-xl
                        p-5
                        text-center
                    ">
                        <p className="
                            text-sm
                            text-gray-500
                        ">
                            No rating or review yet.
                        </p>
                    </div>
                )}

            </div>

        </div>
    );
}

export default AdminDoctorDetails;