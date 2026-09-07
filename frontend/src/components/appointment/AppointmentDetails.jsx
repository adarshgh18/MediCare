import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../../services/api";
import RatingModal from "../patient/RatingModal";

import StatusBadge from "./StatusBadge";

import {
    ArrowLeft,
    CalendarDays,
    Clock3,
    FileText,
    Stethoscope,
    WalletCards,
    MapPin,
    CircleCheck,
    CircleX,
    ClockAlert,
    Star,
    CheckCircle2,
    AlertCircle,
} from "lucide-react";


function AppointmentDetails() {

    const { appointmentId } = useParams();

    const navigate = useNavigate();


    // ----------------------------------
    // State
    // ----------------------------------

    const [appointment, setAppointment] = useState(null);

    const [loading, setLoading] = useState(true);

    const [review, setReview] = useState(null);

    const [showRatingModal, setShowRatingModal] =
        useState(false);


    // ----------------------------------
    // Fetch Appointment
    // ----------------------------------

    const fetchAppointment = async () => {

        try {

            const response = await api.get(
                `/appointments/${appointmentId}`
            );

            setAppointment(response.data.appointment);

        }

        catch (err) {

            console.log(err);

            toast.error(
                err.response?.data?.message ||
                "Unable to load appointment."
            );

        }

        finally {

            setLoading(false);

        }

    };


    // ----------------------------------
    // Fetch Review
    // ----------------------------------

    const fetchReview = async () => {

        try {

            const response = await api.get(
                "/reviews/my"
            );


            const appointmentReview =
                response.data.reviews.find(
                    (item) =>
                        item.appointment === appointmentId ||
                        item.appointment?._id === appointmentId
                );


            setReview(appointmentReview || null);

        }

        catch (err) {

            console.log(err);

        }

    };


    // ----------------------------------
    // Initial Fetch
    // ----------------------------------

    useEffect(() => {

        fetchAppointment();

        fetchReview();

    }, [appointmentId]);


    // ----------------------------------
    // Review Submitted
    // ----------------------------------

    const handleReviewSuccess = (newReview) => {

        setReview(newReview);

    };


    // ----------------------------------
    // Format Date
    // ----------------------------------

    const formatDate = (date) => {

        return new Date(date).toLocaleDateString(
            "en-GB",
            {
                day: "2-digit",
                month: "long",
                year: "numeric",
            }
        );

    };


    // ----------------------------------
    // Cancel Appointment
    // ----------------------------------

    const cancelAppointment = async () => {

        const confirmCancel = window.confirm(
            "Are you sure you want to cancel this appointment?"
        );


        if (!confirmCancel) {

            return;

        }


        try {

            await api.patch(
                `/appointments/${appointment._id}/cancel`
            );


            toast.success(
                "Appointment cancelled successfully."
            );


            // Update appointment locally
            setAppointment((prev) => ({
                ...prev,
                status: "Cancelled",
            }));

        }

        catch (err) {

            console.log(err);

            toast.error(
                err.response?.data?.message ||
                "Unable to cancel appointment."
            );

        }

    };


    // ----------------------------------
    // Loading
    // ----------------------------------

    if (loading) {

        return (

            <div className="
                min-h-[70vh]
                flex
                items-center
                justify-center
            ">

                <p className="text-gray-500">

                    Loading appointment...

                </p>

            </div>

        );

    }


    // ----------------------------------
    // Appointment Not Found
    // ----------------------------------

    if (!appointment) {

        return (

            <div className="
                min-h-[70vh]
                flex
                flex-col
                items-center
                justify-center
                gap-4
            ">

                <p className="text-gray-500">

                    Appointment not found.

                </p>


                <button
                    onClick={() =>
                        navigate("/patient/dashboard")
                    }
                    className="
                        text-blue-600
                        hover:text-blue-700
                        font-medium
                    "
                >

                    Back to Dashboard

                </button>

            </div>

        );

    }


    // ----------------------------------
    // Doctor Information
    // ----------------------------------

    const doctorName =
        appointment.doctor?.user?.fullName ||
        "Doctor";

    const specialization =
        appointment.doctor?.specialization ||
        "—";

    const hospital =
        appointment.doctor?.hospital ||
        "—";

    const consultationFee =
        appointment.doctor?.consultationFee;


    return (

        <div className="min-h-screen  ">

            <div className="
                max-w-6xl
                mx-auto
                px-4
                py-8
            ">


                {/* -------------------------------- */}
                {/* Back */}
                {/* -------------------------------- */}

                <button
                    onClick={() =>
                        navigate("/patient/dashboard")
                    }
                    className="
                        flex
                        items-center
                        gap-2
                        text-sm
                        font-medium
                        text-blue-500
                        hover:text-blue-700
                        transition
                        mb-6
                    "
                >

                    <ArrowLeft size={18} />

                    Back to appointments

                </button>



                {/* -------------------------------- */}
                {/* Appointment Header */}
                {/* -------------------------------- */}

                <div className="
                    bg-white
                    rounded-2xl
                    border border-gray-200
                    shadow-sm
                    p-6 md:p-8
                    mb-6
                ">

                    <div className="
                        flex
                        flex-col
                        sm:flex-row
                        sm:items-start
                        sm:justify-between
                        gap-5
                    ">


                        <div>

                            <div className="
                                flex
                                items-center
                                gap-3
                                flex-wrap
                            ">

                                <StatusBadge
                                    status={appointment.status}
                                    variant="details"
                                    className="
                                        inline-flex
                                        font-semibold
                                        items-center
                                        gap-2
                                        px-3
                                        py-1.5
                                        rounded-full
                                        border
                                        text-sm
                                    "
                                />


                                <span className="
                                    text-sm
                                    text-gray-400
                                ">

                                    Appointment ID:{" "}

                                    {appointment._id}

                                </span>

                            </div>


                            <h1 className="
                                text-3xl
                                md:text-4xl
                                font-bold
                                text-gray-900
                                mt-4
                            ">

                                {appointment.status === "Confirmed"
                                    ? "Your appointment is confirmed"
                                    : appointment.status === "Completed"
                                        ? "Your appointment is completed"
                                        : appointment.status === "Cancelled"
                                            ? "Your appointment was cancelled"
                                            : "Your appointment is pending"
                                }

                            </h1>


                            <p className="
                                text-gray-500
                                mt-3
                                max-w-2xl
                                leading-6
                            ">

                                {appointment.status === "Confirmed" && (

                                    <>
                                        We've reserved your consultation
                                        with Dr. {doctorName}. Please arrive
                                        10 minutes before your scheduled time.
                                    </>

                                )}


                                {appointment.status === "Pending" && (

                                    <>
                                        Your appointment is waiting for
                                        confirmation from the doctor.
                                    </>

                                )}


                                {appointment.status === "Completed" && (

                                    <>
                                        Your consultation with Dr.{" "}
                                        {doctorName} has been completed.
                                        Thank you for choosing MediCare.
                                    </>

                                )}


                                {appointment.status === "Cancelled" && (

                                    <>
                                        This appointment has been cancelled.
                                        You can book another appointment
                                        whenever you need.
                                    </>

                                )}

                            </p>

                        </div>


                        <div className="
                            w-14
                            h-14
                            rounded-2xl
                            bg-blue-50
                            flex
                            items-center
                            justify-center
                            shrink-0
                        ">

                            <CalendarDays
                                size={28}
                                className="text-blue-600"
                            />

                        </div>

                    </div>



                    {/* Appointment Information */}

                    <div className="
                        grid
                        grid-cols-1
                        sm:grid-cols-2
                        lg:grid-cols-4
                        gap-4
                        mt-7
                        pt-6
                        border-t border-gray-100
                    ">


                        {/* Date */}

                        <div className="
                            bg-gray-50
                            rounded-xl
                            p-4
                            border border-gray-100
                        ">

                            <div className="
                                flex
                                items-center
                                gap-2
                                text-gray-400
                                text-xs
                                mb-2
                            ">

                                <CalendarDays size={16} />

                                DATE

                            </div>


                            <p className="
                                font-semibold
                                text-gray-800
                            ">

                                {formatDate(
                                    appointment.appointmentDate
                                )}

                            </p>

                        </div>



                        {/* Time */}

                        <div className="
                            bg-gray-50
                            rounded-xl
                            p-4
                            border border-gray-100
                        ">

                            <div className="
                                flex
                                items-center
                                gap-2
                                text-gray-400
                                text-xs
                                mb-2
                            ">

                                <Clock3 size={16} />

                                TIME

                            </div>


                            <p className="
                                font-semibold
                                text-gray-800
                            ">

                                {appointment.timeSlot}

                            </p>

                        </div>



                        {/* Location */}

                        <div className="
                            bg-gray-50
                            rounded-xl
                            p-4
                            border border-gray-100
                        ">

                            <div className="
                                flex
                                items-center
                                gap-2
                                text-gray-400
                                text-xs
                                mb-2
                            ">

                                <MapPin size={16} />

                                LOCATION

                            </div>


                            <p className="
                                font-semibold
                                text-gray-800
                            ">

                                {hospital}

                            </p>

                        </div>



                        {/* Fee */}

                        <div className="
                            bg-gray-50
                            rounded-xl
                            p-4
                            border border-gray-100
                        ">

                            <div className="
                                flex
                                items-center
                                gap-2
                                text-gray-400
                                text-xs
                                mb-2
                            ">

                                <WalletCards size={16} />

                                CONSULTATION FEE

                            </div>


                            <p className="
                                font-semibold
                                text-gray-800
                            ">

                                ₹{consultationFee}

                            </p>

                        </div>

                    </div>

                </div>



                {/* -------------------------------- */}
                {/* Doctor Details + Before your visit*/}
                {/* -------------------------------- */}

                <div className="
                    grid
                    grid-cols-1
                    lg:grid-cols-3
                    gap-6
                    items-stretch
                ">


                    {/* ================================= */}
                    {/* Doctor Details */}
                    {/* ================================= */}

                    <div className="
                        lg:col-span-2
                        bg-white
                        rounded-2xl
                        border border-gray-200
                        shadow-sm
                        p-6 md:p-8
                        h-full
                    ">


                        <div className="
                            flex
                            items-start
                            justify-between
                            gap-4
                            mb-7
                        ">

                            <div>

                                <p className="
                                    text-sm
                                    font-semibold
                                    text-blue-600
                                ">

                                    Doctor details

                                </p>


                                <h2 className="
                                    text-2xl
                                    font-bold
                                    text-gray-900
                                    mt-1
                                ">

                                    Your consultation

                                </h2>

                            </div>


                            <CheckCircle2
                                size={25}
                                className="text-blue-600"
                            />

                        </div>



                        {/* Doctor */}

                        <div className="
                            flex
                            items-center
                            gap-4
                        ">


                            <div className="
                                w-16
                                h-16
                                rounded-2xl
                                bg-blue-50
                                flex
                                items-center
                                justify-center
                                shrink-0
                            ">

                                <span className="
                                    text-xl
                                    font-bold
                                    text-blue-600
                                ">

                                    {doctorName
                                        .split(" ")
                                        .map(
                                            (word) =>
                                                word[0]
                                        )
                                        .join("")
                                        .slice(0, 2)
                                    }

                                </span>

                            </div>


                            <div>

                                <h3 className="
                                    text-lg
                                    font-bold
                                    text-gray-900
                                ">

                                    {doctorName}

                                </h3>


                                <p className="
                                    text-sm
                                    text-gray-500
                                    mt-1
                                ">

                                    {specialization}

                                    {" · "}

                                    {hospital}

                                </p>


                                {/* Doctor Rating */}

                                <div className="
                                    flex
                                    items-center
                                    gap-1.5
                                    mt-2
                                ">

                                    <Star
                                        size={17}
                                        className="
                                            text-yellow-400
                                            fill-yellow-400
                                        "
                                    />


                                    <span className="
                                        text-sm
                                        font-semibold
                                        text-gray-800
                                    ">

                                        {appointment.doctor
                                            ?.averageRating
                                            ? appointment.doctor.averageRating
                                            : "No ratings"}

                                    </span>

                                </div>

                            </div>

                        </div>



                        {/* Reason */}

                        <div className="
                            mt-7
                            bg-gray-100
                            border border-gray-100
                            rounded-xl
                            p-5
                        ">

                            <div className="
                                flex
                                items-center
                                gap-2
                                mb-2
                            ">

                                <FileText
                                    size={18}
                                    className="text-blue-500"
                                />

                                <h3 className="
                                    font-semibold
                                    text-gray-800
                                ">

                                    Reason for visit

                                </h3>

                            </div>


                            <p className="
                                text-gray-600
                                leading-6
                            ">

                                {appointment.reason}

                            </p>

                        </div>

                    </div>



                    {/* ================================= */}
                    {/* BEFORE YOUR VISIT CARD */}
                    {/* ================================= */}

                    

                    <div
                        className="
                            bg-white
                            shadow-sm
                            border
                            border-gray-200
                            rounded-3xl
                            p-6
                            h-full
                        "
                    >

                        {/* Header */}

                        <div className="
                            flex
                            items-start
                            gap-3
                            mb-6
                        ">

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

                                <Stethoscope
                                    size={20}
                                    className="text-blue-600"
                                />

                            </div>


                            <div>

                                <p className="
                                    text-sm
                                    font-semibold
                                    text-blue-600
                                ">

                                    Patient Guide
                                </p>

                                <h2 className="
                                    text-xl
                                    mt-1
                                    font-bold
                                    text-gray-900
                                ">

                                    Before Your Visit
                                </h2>

                            </div>

                        </div>


                        {/* PENDING */}

                        {appointment.status === "Pending" && (

                            <div>

                                <p className="
                                    text-sm
                                    mb-5
                                    text-gray-600
                                    leading-6
                                ">

                                    Your appointment is waiting for confirmation.
                                </p>


                                <div className="space-y-3">

                                    <div className="flex items-start gap-3">

                                        <div className="
                                            w-7
                                            shrink-0
                                            h-7
                                            rounded-full
                                            bg-blue-50
                                            flex
                                            items-center
                                            justify-center
                                        ">

                                            <Clock3
                                                size={14}
                                                className="text-blue-600"
                                            />

                                        </div>

                                        <p className="text-sm text-gray-600 leading-5">
                                            Check your appointment status before visiting.
                                        </p>

                                    </div>


                                    <div className="flex items-start gap-3">

                                        <div className="
                                            w-7
                                            shrink-0
                                            h-7
                                            rounded-full
                                            bg-blue-50
                                            flex
                                            items-center
                                            justify-center
                                        ">

                                            <CalendarDays
                                                size={14}
                                                className="text-blue-600"
                                            />

                                        </div>

                                        <p className="text-sm text-gray-600 leading-5">
                                            Keep your appointment details handy.
                                        </p>

                                    </div>

                                </div>


                                <button
                                    onClick={cancelAppointment}
                                    className="
                                        w-full
                                        transition
                                        mt-6
                                        inline-flex
                                        items-center
                                        justify-center
                                        gap-2
                                        px-4
                                        py-3
                                        rounded-xl
                                        border
                                        border-red-200
                                        bg-red-50
                                        text-red-600
                                        font-medium
                                        hover:bg-red-100
                                    "
                                >

                                    <CircleX size={17} />

                                    Cancel Appointment

                                </button>

                            </div>

                        )}


                        {/* CONFIRMED */}

                        {appointment.status === "Confirmed" && (

                            <div>

                                <div className="
                                    bg-green-50
                                    mb-5
                                    border
                                    border-green-100
                                    rounded-xl
                                    p-4
                                ">

                                    <div className="
                                        flex
                                        text-sm
                                        items-center
                                        gap-2
                                        text-green-700
                                        font-semibold
                                    ">

                                        <CircleCheck size={17} />

                                        Appointment confirmed

                                    </div>

                                </div>


                                <p className="
                                    text-sm
                                    mb-4
                                    text-gray-600
                                    leading-6
                                ">
                                    We've reserved your consultation with{" "}

                                    <span className="font-semibold text-gray-800">

                                        Dr. {appointment.doctor?.user?.fullName}

                                    </span>
                                    .
                                </p>


                                <div className="space-y-3">

                                    <div className="flex items-start gap-3">

                                        <div className="
                                            w-7
                                            shrink-0
                                            h-7
                                            rounded-full
                                            bg-blue-50
                                            flex
                                            items-center
                                            justify-center
                                        ">

                                            <Clock3
                                                size={14}
                                                className="text-blue-600"
                                            />

                                        </div>

                                        <p className="text-sm text-gray-600 leading-5">
                                            Please arrive 10 minutes before your scheduled time.
                                        </p>

                                    </div>


                                    <div className="flex items-start gap-3">

                                        <div className="
                                            w-7
                                            shrink-0
                                            h-7
                                            rounded-full
                                            bg-blue-50
                                            flex
                                            items-center
                                            justify-center
                                        ">

                                            <FileText
                                                size={14}
                                                className="text-blue-600"
                                            />

                                        </div>

                                        <p className="text-sm text-gray-600 leading-5">
                                            Bring any previous medical reports if required.
                                        </p>

                                    </div>

                                </div>

                            </div>

                        )}


                        {/* COMPLETED */}

                        {appointment.status === "Completed" && (

                            <div>

                                <div className="
                                    bg-blue-50
                                    mb-5
                                    border
                                    border-blue-100
                                    rounded-xl
                                    p-4
                                ">

                                    <div className="
                                        flex
                                        text-sm
                                        items-center
                                        gap-2
                                        text-blue-700
                                        font-semibold
                                    ">

                                        <CircleCheck size={17} />

                                        Consultation completed

                                    </div>

                                </div>


                                <p className="
                                    text-sm
                                    text-gray-600
                                    leading-6
                                ">
                                    Your consultation with{" "}

                                    <span className="font-semibold text-gray-800">

                                        Dr. {appointment.doctor?.user?.fullName}

                                    </span>{" "}

                                    has been completed.
                                </p>


                                <p className="
                                    text-sm
                                    text-gray-500
                                    leading-6
                                    mt-3
                                ">
                                    We hope your consultation was helpful.
                                    You can share your experience below.
                                </p>

                            </div>

                        )}


                        {/* CANCELLED */}

                        {appointment.status === "Cancelled" && (

                            <div>

                                <div className="
                                    bg-red-50
                                    mb-5
                                    border
                                    border-red-100
                                    rounded-xl
                                    p-4
                                ">

                                    <div className="
                                        flex
                                        text-sm
                                        items-center
                                        gap-2
                                        text-red-600
                                        font-semibold
                                    ">

                                        <CircleX size={17} />

                                        Appointment cancelled

                                    </div>

                                </div>


                                <p className="
                                    text-sm
                                    text-gray-600
                                    leading-6
                                ">
                                    This appointment has been cancelled.
                                </p>


                                <p className="
                                    text-sm
                                    text-gray-500
                                    leading-6
                                    mt-3
                                ">
                                    You can book another appointment with this doctor
                                    whenever you need.
                                </p>

                            </div>

                        )}

                    </div>

                </div>



                {/* -------------------------------- */}
                {/* Rating / Review */}
                {/* -------------------------------- */}

                {appointment.status === "Completed" && (

                    <div className="
                        bg-white
                        rounded-2xl
                        border border-gray-200
                        shadow-sm
                        p-6 md:p-8
                        mt-6
                    ">

                        <div className="
                            flex
                            items-start
                            justify-between
                            gap-4
                        ">

                            <div>

                                <p className="
                                    text-sm
                                    font-semibold
                                    text-blue-600
                                ">

                                    After your visit

                                </p>


                                <h2 className="
                                    text-2xl
                                    font-bold
                                    text-gray-900
                                    mt-1
                                ">

                                    How was your consultation?

                                </h2>


                                <p className="
                                    text-gray-500
                                    mt-2
                                ">

                                    Your feedback helps other patients
                                    make confident care decisions.

                                </p>

                            </div>


                            <div className="
                                w-11
                                h-11
                                rounded-full
                                bg-blue-50
                                flex
                                items-center
                                justify-center
                                shrink-0
                            ">

                                <Star
                                    size={22}
                                    className="text-blue-600"
                                />

                            </div>

                        </div>



                        {/* Review Submitted */}

                        {review ? (

                            <div className="
                                mt-6
                                bg-green-50
                                border border-green-100
                                rounded-2xl
                                p-5
                            ">

                                <div className="
                                    flex
                                    items-center
                                    gap-2
                                    text-green-700
                                    font-semibold
                                ">

                                    <CircleCheck size={20} />

                                    Review submitted

                                </div>


                                <div className="
                                    flex
                                    gap-1
                                    mt-4
                                ">

                                    {[1, 2, 3, 4, 5].map(
                                        (star) => (

                                            <Star
                                                key={star}
                                                size={22}
                                                className={
                                                    star <= review.rating
                                                        ? "text-yellow-400 fill-yellow-400"
                                                        : "text-gray-300"
                                                }
                                            />

                                        )
                                    )}

                                </div>


                                {review.comment && (

                                    <p className="
                                        text-green-800
                                        mt-4
                                        leading-6
                                    ">

                                        {review.comment}

                                    </p>

                                )}


                                <p className="
                                    text-sm
                                    text-green-700
                                    mt-3
                                ">

                                    Thank you for sharing your experience.

                                </p>

                            </div>

                        ) : (

                            /* Not Reviewed */

                            // <div className="flex flex-col bg-green-200 sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="
    flex
    flex-col
    sm:flex-row
    sm:items-center
    sm:justify-between
    gap-4
    p-4
    rounded-2xl
    bg-green-50
    border
    border-green-200
    shadow-sm
    mt-2
">

                                {/* Left Side */}
                                <div>

                                    {/* <p className="
            text-sm
            text-gray-500
        "> */}                      <p className="
        text-sm
        font-medium
        text-green-700
    ">

                                        You haven't rated this consultation yet.
                                    </p>

                                    <p className="text-xs text-green-600 mt-1">
        Share your experience with this doctor.
    </p>

                                </div>


                                {/* Right Side */}
                                <button
                                    onClick={() => setShowRatingModal(true)}
                                    className="
            inline-flex
            items-center
            justify-center
            gap-2
            px-5
            py-2.5
            rounded-xl
            bg-blue-600
            hover:bg-blue-700
            text-white
            font-semibold
            text-sm
            transition
            shrink-0
        "
                                >

                                    <Star size={17} />

                                    Rate Doctor

                                </button>

                            </div>

                        )}

                    </div>

                )}

            </div>



            {/* -------------------------------- */}
            {/* Rating Modal */}
            {/* -------------------------------- */}

            {showRatingModal && (

                <RatingModal
                    appointment={appointment}
                    onClose={() =>
                        setShowRatingModal(false)
                    }
                    onSuccess={handleReviewSuccess}
                />

            )}

        </div>

    );

}


export default AppointmentDetails;