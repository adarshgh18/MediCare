import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import api from "../services/api";

import {
    FaUserMd,
    FaHospital,
    FaGraduationCap,
    FaRupeeSign,
    FaClock,
    FaArrowLeft,
    FaStar,
    FaCalendarAlt,
} from "react-icons/fa";

import InfoCard from "../components/doctor/InfoCard";


function DoctorDetails() {

    const { id } = useParams();
    const navigate = useNavigate();

    // =====================================================
    // STATE
    // =====================================================

    const [doctor, setDoctor] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(null);
    const [reviewCount, setReviewCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [doctorNotFound, setDoctorNotFound] = useState(false);
    const [doctorError, setDoctorError] = useState(false);
    const [reviewsError, setReviewsError] = useState(false);

    // =====================================================
    // FETCH DOCTOR
    // =====================================================

    const fetchDoctor = async () => {

        try {

            setLoading(true);

            setDoctorNotFound(false);
            setDoctorError(false);

            const response = await api.get(
                `/doctors/${id}`
            );

            setDoctor(
                response.data.doctor
            );

        }

        catch (err) {

            console.error(
                "Failed to fetch doctor:",
                err
            );


            /*
             * IMPORTANT:
             *
             * If there is no response,
             * backend/network error is handled
             * by our global ServerError flow.
             *
             * We DON'T create another server
             * error UI here.
             */

            if (!err.response) {

                return;

            }


            /*
             * Doctor doesn't exist
             */

            if (err.response.status === 404) {

                setDoctor(null);

                setDoctorNotFound(true);

                return;

            }


            /*
             * Any other API/server error
             */

            setDoctorError(true);

        }

        finally {

            setLoading(false);

        }

    };


    // =====================================================
    // FETCH REVIEWS
    // =====================================================

    const fetchReviews = async () => {

        try {

            setReviewsError(false);

            const response = await api.get(
                `/reviews/doctor/${id}`
            );


            setReviews(
                response.data.reviews || []
            );


            setAverageRating(
                response.data.averageRating ?? null
            );


            setReviewCount(
                response.data.reviewCount || 0
            );

        }

        catch (err) {

            console.error(
                "Failed to fetch doctor reviews:",
                err
            );


            /*
             * Reviews are secondary data.
             *
             * Even if reviews fail,
             * doctor profile should still work.
             */

            setReviews([]);

            setAverageRating(null);

            setReviewCount(0);

            setReviewsError(true);

        }

    };


    // =====================================================
    // FETCH DATA
    // =====================================================

    useEffect(() => {

        const loadDoctorPage = async () => {

            try {

                setLoading(true);
                setDoctorError(false);
                setDoctorNotFound(false);

                // MongoDB ObjectIds are 24 hexadecimal characters.
                // An obviously invalid URL ID should show "Doctor not found"
                // instead of being treated as a server/API error.
                const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(id || "");

                if (!isValidObjectId) {
                    setDoctor(null);
                    setDoctorNotFound(true);
                    return;
                }

                const response = await api.get(
                    `/doctors/${id}`
                );

                const doctorData = response.data.doctor;

                setDoctor(doctorData);

                // Doctor exists, so NOW fetch reviews
                try {

                    const reviewResponse = await api.get(
                        `/reviews/doctor/${id}`
                    );

                    setReviews(
                        reviewResponse.data.reviews || []
                    );

                    setAverageRating(
                        reviewResponse.data.averageRating
                    );

                    setReviewCount(
                        reviewResponse.data.reviewCount || 0
                    );

                } catch (reviewError) {

                    console.error(
                        "Failed to fetch doctor reviews:",
                        reviewError
                    );

                    // Don't destroy the doctor page just
                    // because reviews failed.
                    setReviews([]);
                    setAverageRating(null);
                    setReviewCount(0);

                }

            } catch (error) {

                console.error(
                    "Failed to fetch doctor:",
                    error
                );

                if (!error.response) {

                    // Backend/network problem
                    setDoctorError(true);

                } else if (
                    error.response.status === 404
                ) {

                    // Doctor genuinely doesn't exist
                    setDoctorNotFound(true);

                } else {
                    // Other backend error
                    setDoctorError(true);
                }

            } finally {
                setLoading(false);
            }

        };
        loadDoctorPage();

    }, [id]);


    // =====================================================
    // LOADING STATE
    // =====================================================

    if (loading) {

        return (

            <div className="
                min-h-screen
                flex
                items-center
                justify-center
            ">

                <p className="
                    text-gray-500
                    text-sm
                ">

                    Loading doctor profile...

                </p>

            </div>

        );

    }


    // =====================================================
    // DOCTOR NOT FOUND
    // =====================================================

    if (doctorNotFound) {

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


                    {/* Icon */}

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


                    {/* Heading */}

                    <h1 className="
                        text-xl
                        font-bold
                        text-gray-900
                    ">

                        Doctor not found

                    </h1>


                    {/* Description */}

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


                    {/* Back button */}

                    <button
                        onClick={() =>
                            navigate("/doctors")
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


    // =====================================================
    // OTHER DOCTOR ERROR
    // =====================================================

    if (doctorError) {

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

                        Unable to load doctor

                    </h1>


                    <p className="
                        text-sm
                        text-gray-500
                        mt-2
                        leading-6
                    ">

                        We couldn't load this doctor profile.
                        Please try again.

                    </p>


                    <button
                        onClick={() =>
                            window.location.reload()
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

                        Try Again

                    </button>

                </div>

            </div>

        );

    }


    // =====================================================
    // RATING HELPERS
    // =====================================================

    const getInitials = (name = "") => {

        return name
            .split(" ")
            .map((word) => word[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();

    };


    const renderStars = (rating) => {

        return (

            <div className="flex items-center gap-1">

                {[1, 2, 3, 4, 5].map((star) => (

                    <FaStar
                        key={star}
                        className={
                            star <= rating
                                ? "text-amber-400"
                                : "text-gray-200"
                        }
                        size={16}
                    />

                ))}

            </div>

        );

    };


    // =====================================================
    // RATING DISTRIBUTION
    // =====================================================

    const ratingDistribution = [5, 4, 3, 2, 1].map(
        (rating) => {

            const count = reviews.filter(
                (review) =>
                    review.rating === rating
            ).length;

            return {
                rating,
                count,
            };

        }
    );


    // =====================================================
    // MAIN UI
    // =====================================================

    return (

        <div className="min-h-screen">

            <div className="
                max-w-7xl
                mx-auto
                px-4
                md:px-6
                py-8
            ">


                {/* ================================================= */}
                {/* BACK BUTTON */}
                {/* ================================================= */}

                <button
                    onClick={() => navigate(-1)}
                    className="
                        flex
                        items-center
                        gap-2
                        text-blue-600
                        hover:text-blue-800
                        font-medium
                        mb-7
                        transition
                    "
                >

                    <FaArrowLeft />

                    Back to doctors

                </button>



                {/* ================================================= */}
                {/* MAIN GRID */}
                {/* ================================================= */}

                <div className="
                    grid
                    grid-cols-1
                    lg:grid-cols-[minmax(0,1fr)_390px]
                    gap-6
                    items-start
                ">


                    {/* ================================================= */}
                    {/* LEFT SIDE */}
                    {/* ================================================= */}

                    <div className="space-y-6">


                        {/* DOCTOR HEADER */}

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
                                md:flex-row
                                gap-6
                                items-center
                                md:items-start
                            ">


                                {/* Doctor Image */}

                                <div className="relative shrink-0">

                                    <div className="
                                        w-36
                                        h-36
                                        md:w-44
                                        md:h-44
                                        rounded-2xl
                                        bg-blue-50
                                        overflow-hidden
                                        flex
                                        items-center
                                        justify-center
                                        border
                                        border-blue-100
                                    ">

                                        {doctor.image ? (

                                            <img
                                                src={doctor.image}
                                                alt={
                                                    doctor.user?.fullName
                                                }
                                                className="
                                                    w-full
                                                    h-full
                                                    object-cover
                                                "
                                            />

                                        ) : (

                                            <span className="
                                                text-4xl
                                                font-bold
                                                text-blue-600
                                            ">

                                                {getInitials(
                                                    doctor.user?.fullName
                                                )}

                                            </span>

                                        )}

                                    </div>


                                    <div className="
                                        absolute
                                        -bottom-3
                                        -right-3
                                        w-11
                                        h-11
                                        rounded-full
                                        bg-blue-600
                                        border-4
                                        border-white
                                        flex
                                        items-center
                                        justify-center
                                        shadow
                                    ">

                                        <FaUserMd
                                            className="text-white"
                                            size={18}
                                        />

                                    </div>

                                </div>



                                {/* Doctor Information */}

                                <div className="
                                    flex-1
                                    text-center
                                    md:text-left
                                ">

                                    <p className="
                                        text-sm
                                        font-semibold
                                        text-blue-600
                                        uppercase
                                        tracking-wide
                                    ">

                                        Healthcare Professional

                                    </p>


                                    <h1 className="
                                        text-3xl
                                        md:text-4xl
                                        font-bold
                                        text-gray-900
                                        mt-1
                                    ">

                                        {doctor.user?.fullName}

                                    </h1>


                                    <p className="
                                        text-lg
                                        text-gray-500
                                        mt-1
                                    ">

                                        {doctor.specialization}

                                    </p>


                                    {/* Rating */}

                                    <div className="
                                        flex
                                        flex-wrap
                                        items-center
                                        justify-center
                                        md:justify-start
                                        gap-3
                                        mt-4
                                    ">

                                        {reviewCount > 0 ? (

                                            <>

                                                <div className="
                                                    flex
                                                    items-center
                                                    gap-1.5
                                                ">

                                                    <FaStar
                                                        className="text-amber-400"
                                                    />

                                                    <span className="
                                                        font-bold
                                                        text-gray-900
                                                    ">

                                                        {averageRating}

                                                    </span>

                                                </div>


                                                <span className="
                                                    text-gray-400
                                                ">

                                                    ·

                                                </span>


                                                <span className="
                                                    text-gray-500
                                                    text-sm
                                                ">

                                                    {reviewCount}{" "}
                                                    {reviewCount === 1
                                                        ? "review"
                                                        : "reviews"}

                                                </span>

                                            </>

                                        ) : (

                                            <span className="
                                                text-sm
                                                text-gray-400
                                            ">

                                                No reviews yet

                                            </span>

                                        )}

                                    </div>

                                </div>

                            </div>

                        </div>



                        {/* INFORMATION CARDS */}

                        <div className="
                            grid
                            grid-cols-2
                            xl:grid-cols-4
                            gap-3
                        ">

                            <InfoCard
                                icon={<FaClock />}
                                title="Experience"
                                value={`${doctor.experience} Years`}
                            />


                            <InfoCard
                                icon={<FaHospital />}
                                title="Hospital"
                                value={doctor.hospital}
                            />


                            <InfoCard
                                icon={<FaGraduationCap />}
                                title="Qualification"
                                value={doctor.qualification}
                            />


                            <InfoCard
                                icon={<FaRupeeSign />}
                                title="Consultation Fee"
                                value={`₹${doctor.consultationFee}`}
                            />

                        </div>



                        {/* ABOUT */}

                        <div className="
                            bg-white
                            border
                            border-gray-200
                            rounded-3xl
                            p-6
                            md:p-8
                            shadow-sm
                        ">

                            <h2 className="
                                text-2xl
                                font-bold
                                text-gray-900
                                mb-4
                            ">

                                About Doctor

                            </h2>


                            <p className="
                                text-gray-600
                                leading-7
                            ">

                                {doctor.bio ||
                                    "No biography has been provided for this doctor."}

                            </p>

                        </div>

                    </div>



                    {/* ================================================= */}
                    {/* RIGHT SIDE - AVAILABILITY */}
                    {/* ================================================= */}

                    <div
                        className="
                            bg-white
                            lg:top-24
                            border
                            border-gray-200
                            rounded-3xl
                            p-6
                            shadow-sm
                            lg:sticky
                        "
                    >

                        <div
                            className="
                                flex
                                mb-6
                                items-start
                                justify-between
                                gap-3
                            "
                        >

                            <div>

                                <p className="
                                    text-sm
                                    font-semibold
                                    text-blue-600
                                ">

                                    Book a consultation

                                </p>


                                <h2 className="
                                    text-2xl
                                    mt-1
                                    font-bold
                                    text-gray-900
                                ">

                                    Availability

                                </h2>

                            </div>


                            <div className="
                                w-11
                                shrink-0
                                h-11
                                rounded-full
                                bg-blue-50
                                flex
                                items-center
                                justify-center
                            ">

                                <FaCalendarAlt
                                    className="text-blue-600"
                                />

                            </div>

                        </div>



                        {/* AVAILABILITY */}

                        {doctor.availability?.length > 0 ? (

                            <div className="
                                max-h-[298px]
                                space-y-6
                                overflow-y-auto
                                pr-2
                            ">

                                {doctor.availability.map((day) => (

                                    <div
                                        key={
                                            day._id ||
                                            day.day
                                        }
                                    >

                                        <h3 className="
                                            font-semibold
                                            text-gray-800
                                            mb-3
                                        ">

                                            {day.day}

                                        </h3>


                                        <div className="
                                            grid
                                            grid-cols-2
                                            gap-2
                                        ">

                                            {day.slots.map(
                                                (slot) => (

                                                    <div
                                                        key={slot}
                                                        className="
                                                            px-3
                                                            text-center
                                                            py-2.5
                                                            rounded-full
                                                            border
                                                            border-blue-100
                                                            bg-blue-50
                                                            text-blue-700
                                                            text-sm
                                                            font-medium
                                                        "
                                                    >

                                                        {slot}

                                                    </div>

                                                )
                                            )}

                                        </div>

                                    </div>

                                ))}

                            </div>

                        ) : (

                            <div className="
                                bg-gray-50
                                text-center
                                border
                                border-gray-200
                                rounded-xl
                                p-4
                            ">

                                <p className="
                                    text-sm
                                    text-gray-500
                                ">

                                    No availability has been added yet.

                                </p>

                            </div>

                        )}



                        {/* Divider */}

                        <div className="
                            border-t
                            border-gray-200
                            my-6
                        " />



                        {/* Book Appointment */}

                        <button
                            onClick={() =>
                                navigate(
                                    `/book-appointment/${doctor._id}`
                                )
                            }
                            className="
                                w-full
                                transition
                                bg-blue-600
                                hover:bg-blue-700
                                text-white
                                py-3.5
                                rounded-xl
                                font-semibold
                                shadow-sm
                                hover:shadow
                            "
                        >

                            Book Appointment

                        </button>


                        <p className="
                            text-xs
                            text-gray-400
                            text-center
                            mt-3
                        ">

                            Select your preferred date and time
                            on the booking page.

                        </p>

                    </div>

                </div>



                {/* ================================================= */}
                {/* REVIEWS */}
                {/* ================================================= */}

                <div className="
                    bg-white
                    border
                    border-gray-200
                    rounded-3xl
                    p-6
                    md:p-8
                    shadow-sm
                    mt-7
                ">


                    {/* Reviews Header */}

                    <div className="
                        flex
                        flex-col
                        md:flex-row
                        md:items-center
                        md:justify-between
                        gap-4
                        mb-8
                    ">

                        <div>

                            <p className="
                                text-sm
                                font-semibold
                                text-blue-600
                            ">

                                Patient stories

                            </p>


                            <h2 className="
                                text-2xl
                                font-bold
                                text-gray-900
                                mt-1
                            ">

                                Ratings & Reviews

                            </h2>

                        </div>


                        {reviewCount > 0 && (

                            <div className="
                                flex
                                items-center
                                gap-2
                                bg-blue-50
                                border
                                border-blue-100
                                px-4
                                py-2
                                rounded-full
                            ">

                                <FaStar
                                    className="text-amber-400"
                                />

                                <span className="
                                    font-bold
                                    text-gray-900
                                ">

                                    {averageRating}

                                </span>

                                <span className="
                                    text-gray-500
                                    text-sm
                                ">

                                    ({reviewCount} reviews)

                                </span>

                            </div>

                        )}

                    </div>



                    {/* Reviews Error */}

                    {reviewsError ? (

                        <div className="
                            py-12
                            text-center
                            bg-gray-50
                            rounded-2xl
                        ">

                            <FaStar
                                className="
                                    text-gray-300
                                    mx-auto
                                    mb-3
                                "
                                size={28}
                            />


                            <h3 className="
                                font-semibold
                                text-gray-700
                            ">

                                Reviews unavailable

                            </h3>


                            <p className="
                                text-sm
                                text-gray-500
                                mt-1
                            ">

                                We couldn't load the reviews
                                right now.

                            </p>

                        </div>

                    ) : reviewCount === 0 ? (

                        <div className="
                            py-12
                            text-center
                            bg-gray-50
                            rounded-2xl
                        ">

                            <FaStar
                                className="
                                    text-gray-300
                                    mx-auto
                                    mb-3
                                "
                                size={28}
                            />


                            <h3 className="
                                font-semibold
                                text-gray-700
                            ">

                                No reviews yet

                            </h3>


                            <p className="
                                text-sm
                                text-gray-500
                                mt-1
                            ">

                                Be the first patient to share
                                your experience.

                            </p>

                        </div>

                    ) : (

                        <>


                            {/* Rating Summary */}

                            <div className="
                                grid
                                md:grid-cols-[220px_1fr]
                                gap-8
                                pb-8
                                border-b
                                border-gray-200
                            ">


                                {/* Average */}

                                <div className="
                                    flex
                                    flex-col
                                    items-center
                                    justify-center
                                ">

                                    <p className="
                                        text-5xl
                                        font-bold
                                        text-gray-900
                                    ">

                                        {averageRating}

                                    </p>


                                    <div className="mt-2">

                                        {renderStars(
                                            Math.round(
                                                averageRating
                                            )
                                        )}

                                    </div>


                                    <p className="
                                        text-sm
                                        text-gray-500
                                        mt-2
                                    ">

                                        Based on {reviewCount}{" "}
                                        {reviewCount === 1
                                            ? "review"
                                            : "reviews"}

                                    </p>

                                </div>



                                {/* Distribution */}

                                <div className="
                                    flex
                                    flex-col
                                    justify-center
                                    gap-2
                                ">

                                    {ratingDistribution.map(
                                        (item) => {

                                            const percentage =
                                                reviewCount > 0
                                                    ? (
                                                        item.count /
                                                        reviewCount
                                                    ) * 100
                                                    : 0;


                                            return (

                                                <div
                                                    key={item.rating}
                                                    className="
                                                        flex
                                                        items-center
                                                        gap-3
                                                    "
                                                >

                                                    <span className="
                                                        text-xs
                                                        text-gray-500
                                                        w-8
                                                    ">

                                                        {item.rating}

                                                        <FaStar
                                                            className="
                                                                inline
                                                                ml-1
                                                                text-amber-400
                                                            "
                                                            size={10}
                                                        />

                                                    </span>


                                                    <div className="
                                                        flex-1
                                                        h-2
                                                        bg-gray-100
                                                        rounded-full
                                                        overflow-hidden
                                                    ">

                                                        <div
                                                            className="
                                                                h-full
                                                                bg-amber-400
                                                                rounded-full
                                                            "
                                                            style={{
                                                                width: `${percentage}%`,
                                                            }}
                                                        />

                                                    </div>


                                                    <span className="
                                                        text-xs
                                                        text-gray-400
                                                        w-6
                                                        text-right
                                                    ">

                                                        {item.count}

                                                    </span>

                                                </div>

                                            );

                                        }
                                    )}

                                </div>

                            </div>



                            {/* Recent Reviews */}

                            <div className="mt-8">

                                <h3 className="
                                    text-lg
                                    font-semibold
                                    text-gray-800
                                    mb-4
                                ">

                                    Recent reviews

                                </h3>


                                <div className="
                                    grid
                                    md:grid-cols-2
                                    gap-4
                                ">

                                    {reviews.map(
                                        (review) => (

                                            <div
                                                key={review._id}
                                                className="
                                                    bg-slate-50
                                                    border
                                                    border-gray-100
                                                    rounded-2xl
                                                    p-5
                                                "
                                            >

                                                <div className="
                                                    flex
                                                    items-center
                                                    gap-3
                                                    mb-4
                                                ">

                                                    <div className="
                                                        w-10
                                                        h-10
                                                        rounded-full
                                                        bg-blue-100
                                                        text-blue-600
                                                        flex
                                                        items-center
                                                        justify-center
                                                        font-semibold
                                                    ">

                                                        {getInitials(
                                                            review.patient?.fullName ||
                                                            "Patient"
                                                        )}

                                                    </div>


                                                    <div>

                                                        <p className="
                                                            font-semibold
                                                            text-gray-800
                                                        ">

                                                            {review.patient?.fullName ||
                                                                "Patient"}

                                                        </p>


                                                        <p className="
                                                            text-xs
                                                            text-gray-400
                                                        ">

                                                            {new Date(
                                                                review.createdAt
                                                            ).toLocaleDateString(
                                                                "en-US",
                                                                {
                                                                    month: "short",
                                                                    day: "numeric",
                                                                    year: "numeric",
                                                                }
                                                            )}

                                                        </p>

                                                    </div>

                                                </div>



                                                {renderStars(
                                                    review.rating
                                                )}



                                                <p className="
                                                    text-sm
                                                    text-gray-600
                                                    leading-6
                                                    mt-4
                                                ">

                                                    {review.comment ||
                                                        "No comment provided."}

                                                </p>

                                            </div>

                                        )
                                    )}

                                </div>

                            </div>

                        </>

                    )}

                </div>

            </div>

        </div>

    );

}


export default DoctorDetails;