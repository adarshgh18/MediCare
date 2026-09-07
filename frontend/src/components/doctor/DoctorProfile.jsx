import { useEffect, useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

import {
    FaUserMd,
    FaClock,
    FaHospital,
    FaGraduationCap,
    FaRupeeSign,
    FaCalendarAlt,
    FaEnvelope,
    FaPen,
    FaStar,
    FaRegStar,
} from "react-icons/fa";

import Pagination from "../common/Pagination";


function DoctorProfile() {

    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);


    // ----------------------------------
    // Reviews
    // ----------------------------------

    const [reviews, setReviews] = useState([]);

    const [averageRating, setAverageRating] = useState(null);

    const [reviewCount, setReviewCount] = useState(0);

    const [reviewsLoading, setReviewsLoading] = useState(true);


    // ----------------------------------
    // Review Pagination
    // ----------------------------------

    const [reviewPage, setReviewPage] = useState(1);

    const reviewsPerPage = 6;


    const navigate = useNavigate();



    // ----------------------------------
    // Fetch Doctor Profile
    // ----------------------------------

    useEffect(() => {

        const fetchProfile = async () => {

            try {

                const response = await api.get(
                    "/doctors/me"
                );

                setDoctor(
                    response.data.doctor
                );

            }

            catch (error) {

                console.error(
                    "Error fetching doctor profile:",
                    error
                );

            }

            finally {

                setLoading(false);

            }

        };

        fetchProfile();

    }, []);



    // ----------------------------------
    // Fetch Reviews
    // ----------------------------------

    useEffect(() => {

        if (!doctor?._id) {
            return;
        }


        const fetchReviews = async () => {

            try {

                setReviewsLoading(true);


                const response = await api.get(
                    `/reviews/doctor/${doctor._id}`
                );


                setReviews(
                    response.data.reviews || []
                );


                setAverageRating(
                    response.data.averageRating
                );


                setReviewCount(
                    response.data.reviewCount || 0
                );

            }

            catch (error) {

                console.error(
                    "Error fetching doctor reviews:",
                    error
                );

            }

            finally {

                setReviewsLoading(false);

            }

        };


        fetchReviews();

    }, [doctor?._id]);



    // ----------------------------------
    // Reset review page if reviews change
    // ----------------------------------

    useEffect(() => {

        setReviewPage(1);

    }, [reviewCount]);



    // ----------------------------------
    // Rating Helpers
    // ----------------------------------

    const renderStars = (
        rating,
        size = 16
    ) => {

        return (

            <div className="flex items-center gap-1">

                {[1, 2, 3, 4, 5].map(
                    (star) => (

                        star <= Math.round(rating) ? (

                            <FaStar
                                key={star}
                                size={size}
                                className="text-yellow-400"
                            />

                        ) : (

                            <FaRegStar
                                key={star}
                                size={size}
                                className="text-gray-300"
                            />

                        )

                    )
                )}

            </div>

        );

    };



    // ----------------------------------
    // Rating Distribution
    // ----------------------------------

    const getRatingCount = (
        rating
    ) => {

        return reviews.filter(
            (review) =>
                review.rating === rating
        ).length;

    };


    const getRatingPercentage = (
        rating
    ) => {

        if (reviewCount === 0) {
            return 0;
        }


        return Math.round(
            (
                getRatingCount(rating) /
                reviewCount
            ) * 100
        );

    };



    // ----------------------------------
    // Review Date
    // ----------------------------------

    const formatReviewDate = (
        date
    ) => {

        return new Date(date).toLocaleDateString(
            "en-GB",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );

    };



    // ----------------------------------
    // Review Pagination
    // ----------------------------------

    const totalReviewPages = Math.ceil(
        reviews.length / reviewsPerPage
    );


    const startReviewIndex =
        (reviewPage - 1) *
        reviewsPerPage;


    const currentReviews =
        reviews.slice(
            startReviewIndex,
            startReviewIndex + reviewsPerPage
        );



    // ----------------------------------
    // Loading
    // ----------------------------------

    if (loading) {

        return (

            <div className="
                max-w-6xl
                mx-auto
                px-4
                py-10
                text-center
            ">

                <p className="text-gray-500">

                    Loading profile...

                </p>

            </div>

        );

    }



    // ----------------------------------
    // Doctor Not Found
    // ----------------------------------

    if (!doctor) {

        return (

            <div className="
                max-w-6xl
                mx-auto
                px-4
                py-10
                text-center
            ">

                <p className="text-red-500">

                    Doctor profile not found.

                </p>

            </div>

        );

    }



    return (

        <div className="
            min-h-screen
            py-8
            px-4
        ">

            <div className="
                max-w-3xl
                mx-auto
            ">


                {/* ==================================================
                    DOCTOR DETAILS CONTAINER
                ================================================== */}

                <div className="
                    bg-white
                    rounded-2xl
                    shadow-sm
                    border
                    border-gray-200
                    overflow-hidden
                ">


                    {/* ==============================
                        HEADER
                    ============================== */}

                    <div className="
                        px-6
                        md:px-8
                        pt-7
                        pb-6
                    ">

                        <p className="
                            text-xs
                            font-semibold
                            text-gray-500
                            uppercase
                            tracking-wide
                            mb-5
                        ">

                            My Profile

                        </p>


                        <div className="
                            flex
                            items-center
                            gap-5
                        ">


                            {/* Doctor Image */}

                            <div className="
                                relative
                                flex-shrink-0
                            ">

                                <img
                                    src={doctor.image}
                                    alt={
                                        doctor.user.fullName
                                    }
                                    className="
                                        w-24
                                        h-24
                                        md:w-28
                                        md:h-28
                                        rounded-2xl
                                        object-cover
                                        border-2
                                        border-blue-100
                                    "
                                />


                                <div className="
                                    absolute
                                    -bottom-3
                                    -right-3
                                    w-10
                                    h-10
                                    bg-blue-50
                                    border-2
                                    border-white
                                    rounded-full
                                    flex
                                    items-center
                                    justify-center
                                    shadow-sm
                                ">

                                    <FaUserMd
                                        className="
                                            text-blue-600
                                            text-lg
                                        "
                                    />

                                </div>

                            </div>



                            {/* Doctor Basic Information */}

                            <div className="min-w-0">

                                <h1 className="
                                    text-2xl
                                    md:text-3xl
                                    font-bold
                                    text-gray-800
                                ">

                                    {
                                        doctor.user.fullName
                                    }

                                </h1>


                                <p className="
                                    inline-block
                                    mt-2
                                    px-3
                                    py-1
                                    bg-blue-50
                                    text-blue-700
                                    rounded-full
                                    text-sm
                                    font-medium
                                ">

                                    {doctor.specialization}

                                </p>


                                <div className="
                                    flex
                                    items-center
                                    gap-2
                                    mt-3
                                    text-gray-500
                                    text-sm
                                ">

                                    <FaEnvelope
                                        className="
                                            text-gray-400
                                        "
                                    />

                                    <span>
                                        {doctor.user.email}
                                    </span>

                                </div>

                            </div>

                        </div>

                    </div>



                    {/* Divider */}

                    <div className="
                        border-t
                        border-gray-200
                    " />



                    {/* ==============================
                        PROFILE DETAILS
                    ============================== */}

                    <div className="
                        px-6
                        md:px-8
                        py-7
                    ">


                        {/* Information Cards */}

                        <div className="
                            grid
                            grid-cols-1
                            md:grid-cols-2
                            gap-3
                            mb-7
                        ">


                            {/* Experience */}

                            <div className="
                                flex
                                items-center
                                gap-4
                                border
                                border-gray-200
                                rounded-xl
                                p-4
                            ">

                                <div className="
                                    w-11
                                    h-11
                                    flex-shrink-0
                                    bg-blue-50
                                    rounded-xl
                                    flex
                                    items-center
                                    justify-center
                                ">

                                    <FaClock
                                        className="
                                            text-blue-600
                                            text-lg
                                        "
                                    />

                                </div>


                                <div>

                                    <p className="
                                        text-xs
                                        text-gray-500
                                        uppercase
                                        tracking-wide
                                    ">

                                        Experience

                                    </p>

                                    <p className="
                                        font-semibold
                                        text-gray-800
                                        mt-1
                                    ">

                                        {doctor.experience}
                                        {" "}
                                        Years

                                    </p>

                                </div>

                            </div>



                            {/* Hospital */}

                            <div className="
                                flex
                                items-center
                                gap-4
                                border
                                border-gray-200
                                rounded-xl
                                p-4
                            ">

                                <div className="
                                    w-11
                                    h-11
                                    flex-shrink-0
                                    bg-blue-50
                                    rounded-xl
                                    flex
                                    items-center
                                    justify-center
                                ">

                                    <FaHospital
                                        className="
                                            text-blue-600
                                            text-lg
                                        "
                                    />

                                </div>


                                <div className="min-w-0">

                                    <p className="
                                        text-xs
                                        text-gray-500
                                        uppercase
                                        tracking-wide
                                    ">

                                        Hospital

                                    </p>

                                    <p className="
                                        font-semibold
                                        text-gray-800
                                        mt-1
                                        truncate
                                    ">

                                        {doctor.hospital}

                                    </p>

                                </div>

                            </div>



                            {/* Qualification */}

                            <div className="
                                flex
                                items-center
                                gap-4
                                border
                                border-gray-200
                                rounded-xl
                                p-4
                            ">

                                <div className="
                                    w-11
                                    h-11
                                    flex-shrink-0
                                    bg-blue-50
                                    rounded-xl
                                    flex
                                    items-center
                                    justify-center
                                ">

                                    <FaGraduationCap
                                        className="
                                            text-blue-600
                                            text-lg
                                        "
                                    />

                                </div>


                                <div className="min-w-0">

                                    <p className="
                                        text-xs
                                        text-gray-500
                                        uppercase
                                        tracking-wide
                                    ">

                                        Qualification

                                    </p>

                                    <p className="
                                        font-semibold
                                        text-gray-800
                                        mt-1
                                        truncate
                                    ">

                                        {doctor.qualification}

                                    </p>

                                </div>

                            </div>



                            {/* Consultation Fee */}

                            <div className="
                                flex
                                items-center
                                gap-4
                                border
                                border-gray-200
                                rounded-xl
                                p-4
                            ">

                                <div className="
                                    w-11
                                    h-11
                                    flex-shrink-0
                                    bg-blue-50
                                    rounded-xl
                                    flex
                                    items-center
                                    justify-center
                                ">

                                    <FaRupeeSign
                                        className="
                                            text-blue-600
                                            text-lg
                                        "
                                    />

                                </div>


                                <div>

                                    <p className="
                                        text-xs
                                        text-gray-500
                                        uppercase
                                        tracking-wide
                                    ">

                                        Consultation Fee

                                    </p>

                                    <p className="
                                        font-semibold
                                        text-gray-800
                                        mt-1
                                    ">

                                        ₹
                                        {doctor.consultationFee}

                                    </p>

                                </div>

                            </div>

                        </div>



                        {/* ==============================
                            ABOUT
                        ============================== */}

                        <div className="
                            border
                            border-gray-200
                            rounded-xl
                            p-5
                            mb-7
                        ">

                            <div className="
                                flex
                                items-center
                                gap-2
                                mb-3
                            ">

                                <FaUserMd
                                    className="
                                        text-blue-600
                                    "
                                />

                                <h2 className="
                                    text-base
                                    font-semibold
                                    text-gray-800
                                ">

                                    About

                                </h2>

                            </div>


                            <p className="
                                text-sm
                                text-gray-500
                                leading-6
                            ">

                                {doctor.bio}

                            </p>

                        </div>



                        {/* ==============================
                            AVAILABILITY
                        ============================== */}

                        <div className="
                            border
                            border-gray-200
                            bg-gray-100
                            rounded-xl
                            p-5
                        ">

                            <div className="
                                flex
                                items-center
                                gap-2
                                mb-5
                            ">

                                <FaCalendarAlt
                                    className="
                                        text-blue-600
                                    "
                                />

                                <h2 className="
                                    text-base
                                    font-semibold
                                    text-gray-800
                                ">

                                    Availability

                                </h2>

                            </div>



                            {doctor.availability &&
                            doctor.availability.length > 0 ? (

                                doctor.availability.map(
                                    (day) => (

                                        <div
                                            key={
                                                day._id ||
                                                day.day
                                            }
                                            className="
                                                mb-5
                                                last:mb-0
                                            "
                                        >

                                            <h3 className="
                                                text-sm
                                                font-semibold
                                                text-gray-700
                                                mb-2
                                            ">

                                                {day.day}

                                            </h3>


                                            <div className="
                                                flex
                                                flex-wrap
                                                gap-2
                                            ">

                                                {day.slots.map(
                                                    (slot) => (

                                                        <span
                                                            key={slot}
                                                            className="
                                                                px-3
                                                                py-1.5
                                                                rounded-lg
                                                                border
                                                                border-blue-200
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

                                )

                            ) : (

                                <p className="
                                    text-sm
                                    text-gray-500
                                ">

                                    No availability added yet.

                                </p>

                            )}

                        </div>



                        {/* ==============================
                            BUTTONS
                        ============================== */}

                        <div className="
                            border-t
                            border-gray-200
                            mt-7
                            pt-5
                            flex
                            justify-end
                            gap-3
                        ">

                            <button
                                onClick={() =>
                                    navigate(
                                        "/doctor/availability"
                                    )
                                }
                                className="
                                    flex
                                    items-center
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

                                <FaCalendarAlt />

                                Manage Availability

                            </button>


                            <button
                                onClick={() =>
                                    navigate(
                                        "/doctor/profile/edit"
                                    )
                                }
                                className="
                                    flex
                                    items-center
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

                                <FaPen />

                                Edit Profile

                            </button>

                        </div>

                    </div>

                </div>



                {/* ==================================================
                    PATIENT REVIEWS CONTAINER
                ================================================== */}

                <div className="
                    bg-white
                    rounded-2xl
                    shadow-sm
                    border
                    border-gray-200
                    p-6
                    md:p-8
                    mt-7
                ">


                    {/* ==============================
                        REVIEWS HEADER
                    ============================== */}

                    <div className="
                        flex
                        items-start
                        justify-between
                        gap-4
                        mb-6
                    ">

                        <div>

                            <div className="
                                flex
                                items-center
                                gap-2
                            ">

                                <FaStar
                                    className="
                                        text-yellow-400
                                    "
                                />

                                <h2 className="
                                    text-lg
                                    font-semibold
                                    text-gray-800
                                ">

                                    Patient Reviews

                                </h2>

                            </div>


                            <p className="
                                text-sm
                                text-gray-500
                                mt-1
                            ">

                                Feedback from patients
                                who completed consultations.

                            </p>

                        </div>


                        {reviewCount > 0 && (

                            <span className="
                                text-sm
                                font-medium
                                text-gray-500
                                whitespace-nowrap
                            ">

                                {reviewCount}{" "}
                                {
                                    reviewCount === 1
                                        ? "Review"
                                        : "Reviews"
                                }

                            </span>

                        )}

                    </div>



                    {/* ==============================
                        LOADING
                    ============================== */}

                    {reviewsLoading ? (

                        <div className="
                            py-10
                            text-center
                        ">

                            <p className="
                                text-sm
                                text-gray-500
                            ">

                                Loading reviews...

                            </p>

                        </div>

                    ) : reviewCount === 0 ? (

                        /* ==========================
                            NO REVIEWS
                        ========================== */

                        <div className="
                            bg-gray-50
                            border
                            border-gray-200
                            rounded-xl
                            p-8
                            text-center
                        ">

                            <div className="
                                w-12
                                h-12
                                mx-auto
                                rounded-full
                                bg-yellow-50
                                flex
                                items-center
                                justify-center
                                mb-3
                            ">

                                <FaStar
                                    className="
                                        text-yellow-400
                                        text-xl
                                    "
                                />

                            </div>


                            <h3 className="
                                font-semibold
                                text-gray-800
                            ">

                                No reviews yet

                            </h3>


                            <p className="
                                text-sm
                                text-gray-500
                                mt-1
                            ">

                                Patient feedback will
                                appear here after completed
                                consultations.

                            </p>

                        </div>

                    ) : (

                        <>

                            {/* ==========================
                                RATING SUMMARY
                            ========================== */}

                            <div className="
                                bg-gray-50
                                border
                                border-gray-200
                                rounded-xl
                                p-5
                                mb-7
                            ">

                                <div className="
                                    grid
                                    grid-cols-1
                                    sm:grid-cols-[140px_1fr]
                                    gap-6
                                    items-center
                                ">


                                    {/* Average */}

                                    <div className="
                                        text-center
                                        sm:border-r
                                        sm:border-gray-200
                                        sm:pr-6
                                    ">

                                        <p className="
                                            text-4xl
                                            font-bold
                                            text-gray-800
                                        ">

                                            {averageRating}

                                        </p>


                                        <div className="
                                            flex
                                            justify-center
                                            mt-2
                                        ">

                                            {renderStars(
                                                averageRating,
                                                16
                                            )}

                                        </div>


                                        <p className="
                                            text-xs
                                            text-gray-500
                                            mt-2
                                        ">

                                            Based on{" "}
                                            {reviewCount}{" "}
                                            {
                                                reviewCount === 1
                                                    ? "review"
                                                    : "reviews"
                                            }

                                        </p>

                                    </div>



                                    {/* Rating Distribution */}

                                    <div className="
                                        space-y-2
                                    ">

                                        {[5, 4, 3, 2, 1].map(
                                            (rating) => (

                                                <div
                                                    key={rating}
                                                    className="
                                                        flex
                                                        items-center
                                                        gap-2
                                                    "
                                                >

                                                    <span className="
                                                        text-xs
                                                        text-gray-500
                                                        w-8
                                                    ">

                                                        {rating} ★

                                                    </span>


                                                    <div className="
                                                        flex-1
                                                        h-2
                                                        bg-gray-200
                                                        rounded-full
                                                        overflow-hidden
                                                    ">

                                                        <div
                                                            className="
                                                                h-full
                                                                bg-yellow-400
                                                                rounded-full
                                                            "
                                                            style={{
                                                                width:
                                                                    `${getRatingPercentage(
                                                                        rating
                                                                    )}%`,
                                                            }}
                                                        />

                                                    </div>


                                                    <span className="
                                                        text-xs
                                                        text-gray-400
                                                        w-7
                                                        text-right
                                                    ">

                                                        {
                                                            getRatingCount(
                                                                rating
                                                            )
                                                        }

                                                    </span>

                                                </div>

                                            )
                                        )}

                                    </div>

                                </div>

                            </div>



                            {/* ==========================
                                REVIEWS GRID
                            ========================== */}

                            <div className="
                                grid
                                grid-cols-1
                                md:grid-cols-2
                                gap-4
                            ">

                                {currentReviews.map(
                                    (review) => (

                                        <div
                                            key={review._id}
                                            className="
                                                border
                                                border-gray-200
                                                rounded-xl
                                                p-5
                                                bg-white
                                            "
                                        >

                                            {/* Review Header */}

                                            <div className="
                                                flex
                                                items-start
                                                justify-between
                                                gap-3
                                            ">


                                                {/* Patient */}

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
                                                            review.patient
                                                                ?.fullName ||
                                                            "Patient"
                                                        }

                                                    </p>


                                                    <div className="
                                                        flex
                                                        items-center
                                                        gap-2
                                                        mt-1
                                                    ">

                                                        {renderStars(
                                                            review.rating,
                                                            14
                                                        )}

                                                        <span className="
                                                            text-xs
                                                            text-gray-400
                                                        ">

                                                            {
                                                                review.rating
                                                            }/5

                                                        </span>

                                                    </div>

                                                </div>



                                                {/* Date */}

                                                <span className="
                                                    text-xs
                                                    text-gray-400
                                                    whitespace-nowrap
                                                ">

                                                    {
                                                        formatReviewDate(
                                                            review.createdAt
                                                        )
                                                    }

                                                </span>

                                            </div>



                                            {/* Comment */}

                                            {review.comment ? (

                                                <p className="
                                                    text-sm
                                                    text-gray-600
                                                    leading-6
                                                    mt-4
                                                ">

                                                    "{review.comment}"

                                                </p>

                                            ) : (

                                                <p className="
                                                    text-sm
                                                    text-gray-400
                                                    italic
                                                    mt-4
                                                ">

                                                    No comment provided.

                                                </p>

                                            )}

                                        </div>

                                    )
                                )}

                            </div>



                            {/* ==========================
                                PAGINATION
                            ========================== */}

                            {totalReviewPages > 1 && (

                                <div className="
                                    mt-7
                                    flex
                                    justify-center
                                ">

                                    <Pagination
                                        currentPage={
                                            reviewPage
                                        }
                                        totalPages={
                                            totalReviewPages
                                        }
                                        onPageChange={
                                            setReviewPage
                                        }
                                    />

                                </div>

                            )}

                        </>

                    )}

                </div>

            </div>

        </div>

    );

}

export default DoctorProfile;